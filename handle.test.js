const handleDropAndDrag = {
  delicious: true,
  sour: false,
};

describe('handle drop', () => {
  test('if drag and drop  delicious ', () => {
    expect(handleDropAndDrag.delicious).toBeTruthy();
  });

  test('if does not drag and drop sour', () => {
    expect(handleDropAndDrag.sour).toBeFalsy();
  });
});
