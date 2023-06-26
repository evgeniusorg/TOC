import { Page } from "../app/types";

// формируем дерево из входящих данных
export const getTree = (data: any): Page[] => {
  const pages = data.entities.pages;
  let topLevelIds = data.topLevelIds;

  if (!topLevelIds.length) {
    for (let key in pages) {
      if (pages[key].level === 0) {
        topLevelIds.push(key);
      }
    }
  }

  const getPages = (keys: string[]): Page[] => {
    const arr: any = [];
    for (let key of keys) {
      const item = pages[key];
      if (pages[key].pages) {
        item.pages = getPages(pages[key].pages);
      }
      arr.push(item as Page);
    }

    arr.sort((a: Page, b: Page) => a.tabIndex - b.tabIndex);

    return arr;
  }

  const tree = getPages(topLevelIds);
  return tree;
};

// ищем в title искомую строку
const checkPageTitle = (title: string, search: string): boolean => {
  return title.toLowerCase().indexOf(search) !== -1;
}

// фильтруем pages по искомой строке в title
export const filterTree = (tree: Page[], search: string): Page[] => {
  return tree.reduce((newTree: Page[], page: Page): Page[] => {
    const isPageChosen = checkPageTitle(page.title, search);
    const filteredChildren = filterTree(page.pages || [], search);

    if (isPageChosen) {
      // если совпадение в самой page, то копируем page со всеми children
      newTree.push(page);
    } else if (filteredChildren.length > 0) {
      // если есть совпадение в children, то копируем page только с совпадающими children
      newTree.push({ ...page, pages: filteredChildren });
    }

    return newTree;
  }, []);
}