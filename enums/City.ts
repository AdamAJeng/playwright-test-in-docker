export enum City {
  Luleå = 'Luleå',
  Sundsvall = 'Sundsvall',
  Stockholm = 'Stockholm',
  Malmö = 'Malmö',
}

export const CityZoneMap: Record<City, string> = {
  [City.Luleå]: 'SE1',
  [City.Sundsvall]: 'SE2',
  [City.Stockholm]: 'SE3',
  [City.Malmö]: 'SE4',
};

export const CitySlug: Record<City, string> = {
  [City.Luleå]: 'lulea',
  [City.Sundsvall]: 'sundsvall',
  [City.Stockholm]: 'stockholm',
  [City.Malmö]: 'malmo',
};
