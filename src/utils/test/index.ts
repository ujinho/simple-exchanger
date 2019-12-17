import * as storeon from 'reducers/storeon';

export const mockUseStoreon = (state: any) => {
  jest.spyOn(storeon, 'useStoreon').mockImplementation(() => state);
};
