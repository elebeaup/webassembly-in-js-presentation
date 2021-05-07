const historyHandler = () => {
    const entries = [];
    let cursor = 0;
    let lastEntry = '';
  
    return {
      push: (entry) => {
        if (entries.length === 0 || entries[entries.length - 1] !== entry) {
          entries.push(entry);
        }
        cursor = entries.length;
      },
  
      previous: (currentEntry = '') => {
        if (cursor === entries.length) {
          lastEntry = currentEntry;
        }
  
        if (entries.length > 0) {
          cursor = Math.max(0, cursor - 1);
          return entries[cursor];
        }
      },
  
      next: () => {
        if (cursor + 1 >= entries.length) {
          cursor = entries.length;
          return lastEntry;
        } else {
          cursor = cursor + 1;
          return entries[cursor];
        }
      },
  
      rewind: () => {
        cursor = entries.length();
      },
    };
  };

  export default historyHandler;