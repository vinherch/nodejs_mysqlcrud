module.exports = {
  getFormattedDate: (date) => {
    const dateFormatter = Intl.DateTimeFormat("en-CH", { dateStyle: "full", timeStyle: "short" });
    return dateFormatter.format(date);
  },
};
