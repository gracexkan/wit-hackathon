import { createContext, useContext } from 'react';

// Import google calendar api
const timetableContext = createContext(null);

export const TimetableProvider = ({ children, value }) => (
  <timetableContext.Provider value={value}>{children}</timetableContext.Provider>
);

const useTimetable = () => {
  const context = useContext(timetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};

export default useTimetable;