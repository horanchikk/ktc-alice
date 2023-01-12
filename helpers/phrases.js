function lessonsPhrase(arr) {
  let result = undefined;
  if (arr.lessons.length === 1) {
    result = "пара";
  } else if (arr.lessons.length >= 2 && arr.lessons.length <= 4) {
    result = "пары";
  } else {
    result = "пар";
  }
  return result;
}

function dayPhrase(currentDay) {
  if (currentDay.title.split(", ")[1] === "Среда") {
    result = "среду";
  } else if (currentDay.title.split(", ")[1] === "Пятница") {
    result = "пятницу";
  } else if (currentDay.title.split(", ")[1] === "Суббота") {
    result = "субботу";
  } else {
    result = currentDay.title.split(", ")[1].toLowerCase();
  }
  return result;
}

module.exports = { lessonsPhrase, dayPhrase };
