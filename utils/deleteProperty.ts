
export const deleteProperty = (obj: any, propToDelete: string) => {
  delete obj[propToDelete];

  return obj;
};
