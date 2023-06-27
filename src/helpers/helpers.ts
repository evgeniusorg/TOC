import {Page, Anchor, ApiResponse} from '../app/types';

// create tree from api data
export const getParsingData = (tree: ApiResponse, activePageUrl: string): [Page[], Anchor[]] => {
  const pages = tree.entities.pages || {};
  const anchors = tree.entities.anchors || {};
  let topLevelIds = tree.topLevelIds;
  let activePageAnchors: Anchor[] = [];

  // create top level pages list
  if (!topLevelIds.length) {
    for (let key in pages) {
      if (pages[key].level === 0) {
        topLevelIds.push(key);
      }
    }
  }

  const getPages = (keys: string[]): Page[] => {
    const tree: Page[] = [];
    for (let key of keys) {
      const page = pages[key] as Page;

      // pick page as active, if urls are equal
      if (page.url === activePageUrl) {
        page.isActive = true;
      }

      // if page is active, select anchors for this page
      if (page.isActive && pages[key].anchors) {
        activePageAnchors = (pages[key].anchors as string[]).map((anchor_id) => anchors[anchor_id]).filter(Boolean);
      }

      page.pagesCount = 1;

      // if page has sub-pages, set sub-pages data to tree
      if (pages[key].pages) {
        page.pages = getPages(pages[key].pages as string[]);
        page.pagesCount = page.pages.reduce((acc, page) => acc + page.pagesCount, 0);

        // check open or active sub-pages
        if (page.pages.find((subPage) => subPage.isActive || subPage.isOpen)) {
          page.isOpen = true;
        }
      }

      tree.push(page as Page);
    }

    return tree;
  }

  const parsedTree = getPages(topLevelIds);

  return [parsedTree, activePageAnchors];
};

// look for search string to title
export const checkPageTitle = (title: string, search: string): boolean => {
  return title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
}

// pages filter by search string in title
export const getFilterTree = (tree: Page[], search: string): Page[] => {
  return tree.reduce((newTree: Page[], page: Page): Page[] => {
    const isPageChosen = checkPageTitle(page.title, search);
    const filteredChildren = getFilterTree(page.pages || [], search);

    if (isPageChosen) {
      // if title of page includes search string, select page with all sub-pages
      newTree.push({ ...page, isOpen: false });
    } else if (filteredChildren.length > 0) {
      // if some sub-page titles include search string, select only these pages with current page
      newTree.push({ ...page, isOpen: false, pages: filteredChildren });
    }

    return newTree;
  }, []);
}