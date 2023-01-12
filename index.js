const { json } = require("micro");
const { reply } = require("alice-renderer");
const { filter } = require("fuzzaldrin");
const { default: axios } = require("axios");
const moment = require("moment");
require('moment/locale/ru')

// helpers
const { wordToNumber } = require("./helpers/wordToNumber");
const { lessonsPhrase, dayPhrase } = require("./helpers/phrases");

module.exports = async (req, res) => {
  const { version, session, request } = await json(req);

  let text =
    "Для того, чтобы узнать расписание своей группы, скажите: расписание и название своей группы.";

  const saying = request["original_utterance"];

  let currentGroups = await axios
    .get("https://mob.kansk-tc.ru/ktc-api/courses/1")
    .then((res) => {
      let result = [];
      for (let groups of res.data) {
        for (let group of groups.groups) {
          result.push(group);
        }
      }
      return result;
    });

  if (
    saying.toLowerCase() === "помощь" ||
    saying.toLowerCase() === "что ты умеешь"
  ) {
    text =
      "Для того, чтобы узнать расписание своей группы, скажите: расписание, название своей группы, на неделю, на завтра, на сегодня.";
  } else if (saying.slice(0, 10).toLowerCase() === "расписание") {
    let when = null;
    let sayingSplitted = saying.split(" ");

    if (sayingSplitted.includes("на")) {
      if (sayingSplitted.includes("завтра")) {
        when = 1;
      } else if (sayingSplitted.includes("сегодня")) {
        when = 0;
      } else if (sayingSplitted.includes("неделю")) {
        when = 2;
      } else {
        when = 0;
      }
    } else {
      when = 2;
    }

    let groupNameFix = () => {
      const keywords = ["расписание", "на", "сегодня", "завтра", "неделю"];
      let fixedGroupName = sayingSplitted;
      for (let keyword of keywords) {
        let index = sayingSplitted.indexOf(keyword);
        if (index > -1) {
          fixedGroupName.splice(index, 1);
        }
      }
      return fixedGroupName.join(" ");
    };

    let groupName = groupNameFix();

    let groupNameToNumber = [];
    for (let word of groupName.split(" ")) {
      groupNameToNumber.push(wordToNumber(word));
    }

    let selectedGroup = filter(currentGroups, groupNameToNumber.join(""), {
      key: "title",
    })[0];

    if (selectedGroup) {
      let subjects = await axios
        .get(`https://mob.kansk-tc.ru/ktc-api/timetable/${selectedGroup.id}/0`)
        .then((res) => {
          let result = undefined;

          if (when === 2) {
            // на неделю
            let days = [];
            for (let day of res.data.days) {
              if (day.lessons.length > 0) {
                let lessons = [];

                for (lesson of day.lessons) {
                  lessons.push(lesson.title);
                }

                days.push(
                  `${dayPhrase(day) === "вторник" ? "Во" : "В"} ${dayPhrase(
                    day
                  )} будет ${day.lessons.length} ${lessonsPhrase(
                    day
                  )}: ${lessons.join(", ")}. `
                );
              }
            }
            result = days.join("");
          } else if (when === 0) {
            // на сегодня

            for (let day of res.data.days) {
              let lessons = [];

              if (
                day.lessons.length > 0 &&
                day.title.split(", ")[0].toLowerCase() ===
                  moment(new Date()).format("D MMMM")
              ) {
                for (let lesson of day.lessons) {
                  lessons.push(lesson.title);
                }
                result = lessons.length > 0 ? `Сегодня будет ${day.lessons.length} ${lessonsPhrase(
                  day
                )}: ${lessons.join(", ")}. ` : 'Сегодня пар не будет'
              }
            }
          } else if (when === 1) {
            // на завтра

            for (let day of res.data.days) {
              let lessons = [];

              if (
                day.title.split(", ")[0].toLowerCase() ===
                  moment(new Date()).add(1, "days").format("D MMMM")
              ) {
                for (let lesson of day.lessons) {
                  lessons.push(lesson.title);
                }

                result = lessons.length > 0 ? `Завтра будет ${day.lessons.length} ${lessonsPhrase(
                  day
                )}: ${lessons.join(", ")}. ` : `Завтра пар не будет`
              }
            }
          } else {
            // todo: убрать расписание прошедших дней
            let days = [];
            for (let day of res.data.days) {
              if (day.lessons.length > 0) {
                let lessons = [];

                for (lesson of day.lessons) {
                  lessons.push(lesson.title);
                }

                days.push(
                  `${dayPhrase(day) === "вторник" ? "Во" : "В"} ${dayPhrase(
                    day
                  )} будет ${day.lessons.length} ${lessonsPhrase(
                    day
                  )}: ${lessons.join(", ")}. `
                );
              }
            }
          }

          return result;
        });
      text = `Выбрана группа: ${selectedGroup.title
        .split(".")
        .join(" ")}. ${subjects}`;
    } else {
      text = `Группы ${saying.slice(11)} не существует`;
    }
  }
  const result = reply`${text}`;

  res.end(
    JSON.stringify({
      version,
      session,
      response: result,
    })
  );
};

// todo: завтра будет столько то пар матеши....