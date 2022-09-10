const defaults = {
  isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  isSendNotification: false,
  createdTasks: [],
};

export default defaults;
