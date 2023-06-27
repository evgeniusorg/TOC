import { getParsingData, checkPageTitle, getFilterTree} from './helpers';
import { ApiResponse, Page } from '../app/types';

describe('checkPageTitle function', () => {
  test('coincidence in start of title', () => {
    expect(checkPageTitle('Test text', 'test')).toBeTruthy();
  });

  test('coincidence inside title', () => {
    expect(checkPageTitle('Test text', 'st te')).toBeTruthy();
  });

  test('empty title', () => {
    expect(checkPageTitle('', 'test')).toBeFalsy();
  });

  test('empty search', () => {
    expect(checkPageTitle('Test text', '')).toBeTruthy();
  });
})

describe('getTree function', () => {
  test('empty data', () => {
    const data = {
      entities: {},
      topLevelIds: [],
    }
    expect(getParsingData(data, '')).toEqual([[], []]);
  });

  test('root page with active panel url', () => {
    const page = {
      title: 'title',
      id: 'id_1',
      url: 'url_1',
      tabIndex: 0,
      level: 0,
    };

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page},
        }
      },
      topLevelIds: ['id_1'],
    }
    expect(getParsingData(data, 'url_2')).toEqual([[{...page, pagesCount: 1}], []]);
  });

  test('root page with empty topLevelIds', () => {
    const page = {
      title: 'title',
      id: 'id_1',
      url: 'url_1',
      tabIndex: 0,
      level: 0,
    };

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page},
        }
      },
      topLevelIds: [],
    }
    expect(getParsingData(data, '')).toEqual([[{...page, pagesCount: 1}], []]);
  });

  test('root page with topLevelIds', () => {
    const page = {
      title: 'title',
      id: 'id_1',
      url: 'url_1',
      tabIndex: 0,
      level: 0,
    };

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page},
        }
      },
      topLevelIds: ['id_1'],
    }
    expect(getParsingData(data, '')).toEqual([[{...page, pagesCount: 1}], []]);
  });

  test('root page with same active panel url', () => {
    const page = {
      title: 'title',
      id: 'id_1',
      url: 'url',
      tabIndex: 0,
      level: 0,
    };

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page},
        }
      },
      topLevelIds: [],
    }
    expect(getParsingData(data, 'url')).toEqual([[{...page, pagesCount: 1, isActive: true}], []]);
  });

  test('root page with sub pages', () => {
    const page_1 = {
      title: 'title',
      id: 'id_1',
      url: 'url_1',
      tabIndex: 0,
      level: 0,
      pages: ['id_2', 'id_3'],
    };

    const page_2 = {
      title: 'title 2',
      id: 'id_2',
      url: 'url_2',
      tabIndex: 0,
      level: 1,
    };

    const page_3 = {
      title: 'title 3',
      id: 'id_3',
      url: 'url_3',
      tabIndex: 1,
      level: 1,
    };

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page_1},
          'id_2': {...page_2},
          'id_3': {...page_3},
        }
      },
      topLevelIds: [],
    }
    expect(getParsingData(data, '')).toEqual([[
      {
        ...page_1,
        pagesCount: 2,
        pages: [{...page_2, pagesCount: 1},{...page_3, pagesCount: 1}]}
    ], []]);
  });

  test('root page with active sub page', () => {
    const page_1 = {
      title: 'title',
      id: 'id_1',
      url: 'url',
      tabIndex: 0,
      level: 0,
      pages: ['id_2'],
    };

    const page_2 = {
      title: 'title 2',
      id: 'id_2',
      url: 'url_2',
      tabIndex: 0,
      level: 1,
    };

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page_1},
          'id_2': {...page_2},
        }
      },
      topLevelIds: [],
    }
    expect(getParsingData(data, 'url_2')).toEqual([[
      {
        ...page_1,
        pagesCount: 1,
        isOpen: true,
        pages: [{...page_2, pagesCount: 1, isActive: true}]}
    ], []]);
  });

  test('root page and anchors', () => {
    const page_1 = {
      title: 'title',
      id: 'id_1',
      url: 'url_1',
      tabIndex: 0,
      level: 0,
      pages: ['id_2'],
      anchors: ['anchor_1'],
    };

    const page_2 = {
      title: 'title 2',
      id: 'id_2',
      url: 'url_2',
      tabIndex: 0,
      level: 1,
    };

    const anchor_1 = {
      title: 'Anchor 1',
      id: 'anchor_1',
      anchor: '#anchor_1',
    }

    const anchor_2 = {
      title: 'Anchor 2',
      id: 'anchor_2',
      anchor: '#anchor_2',
    }

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page_1},
          'id_2': {...page_2},
        },
        anchors: {
          'anchor_1': {...anchor_1},
          'anchor_2': {...anchor_2},
        },
      },
      topLevelIds: [],
    }

    expect(getParsingData(data, 'url_1')).toEqual([[
      {
        ...page_1,
        pagesCount: 1,
        isActive: true,
        pages: [{...page_2, pagesCount: 1}]}
    ], [{...anchor_1}]]);
  });

  test('root page with active sub page and anchors', () => {
    const page_1 = {
      title: 'title',
      id: 'id_1',
      url: 'url',
      tabIndex: 0,
      level: 0,
      pages: ['id_2'],
    };

    const page_2 = {
      title: 'title 2',
      id: 'id_2',
      url: 'url_2',
      tabIndex: 0,
      level: 1,
      anchors: ['anchor_1'],
    };

    const anchor_1 = {
      title: 'Anchor 1',
      id: 'anchor_1',
      anchor: '#anchor_1',
    }

    const anchor_2 = {
      title: 'Anchor 2',
      id: 'anchor_2',
      anchor: '#anchor_2',
    }

    const data: ApiResponse = {
      entities: {
        pages: {
          'id_1': {...page_1},
          'id_2': {...page_2},
        },
        anchors: {
          'anchor_1': {...anchor_1},
          'anchor_2': {...anchor_2},
        },
      },
      topLevelIds: [],
    }

    expect(getParsingData(data, 'url_2')).toEqual([[
      {
        ...page_1,
        pagesCount: 1,
        isOpen: true,
        pages: [{...page_2, pagesCount: 1, isActive: true}]}
    ], [{...anchor_1}]]);
  });
});

describe('getFilterTree function', () => {
  test('empty tree', () => {
    expect(getFilterTree([], 'test')).toEqual([]);
  });

  test('empty search', () => {
    const tree = [
      { title: 'Test text' },
      { title: 'New text' },
    ];

    expect(getFilterTree(tree as Page[], ''))
      .toEqual([{ title: 'Test text', isOpen: false },{ title: 'New text', isOpen: false }]);
  });

  test('empty result', () => {
    const tree = [
      { title: 'Test text' },
      { title: 'New text' },
    ];

    expect(getFilterTree(tree as Page[], 'page 1')).toEqual([]);
  });

  test('root page', () => {
    const tree = [
      { title: 'Test text' },
      { title: 'New text' },
    ];

    expect(getFilterTree(tree as Page[], 'test')).toEqual([{ title: 'Test text', isOpen: false },]);
  });

  test('root page with sub-pages', () => {
    const firstPage = { title: 'Test text', pages: [{ title: 'Sub page 1' }, { title: 'Sub page 2' }] };
    const tree = [
      firstPage,
      { title: 'New text' },
    ];

    expect(getFilterTree(tree as Page[], 'test')).toEqual([{ ...firstPage, isOpen: false },]);
  });

  test('sub-page', () => {
    const firstPage = { title: 'Test text', pages: [{ title: 'Sub page 1' }, { title: 'Sub page 2' }] };
    const tree = [
      firstPage,
      { title: 'New text' },
    ];

    expect(getFilterTree(tree as Page[], 'Page 1')).toEqual([{
      title: 'Test text',
      pages: [{ title: 'Sub page 1', isOpen: false }],
      isOpen: false
    }]);
  });
});