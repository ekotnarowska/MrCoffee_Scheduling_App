const days = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
   } 

const getWeekDay = (dayNumber) => {
   const weekDays = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
   } 

   return weekDays[dayNumber]
}


const toUpperCase =  (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


module.exports = {
    counter: (index) => index + 1,
    showDays: (day) => getWeekDay(parseInt(day)),
    toUpperCase: (string) => toUpperCase(string),
    days,
    select: function (selected, options) {
        return options
          .fn(this)
          .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
          )
          .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
          )
      },
}
