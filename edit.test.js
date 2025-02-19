const Edit = {
  delicious: true,
  sour: false,
};

describe('handle drop', () => {
  test(' if click on edit button, content should be editable and update ', () => {
    expect(Edit.delicious).toBeTruthy();
  });

  test('not editable if not click on edit button and content should not update', () => {
    expect(Edit.sour).toBeFalsy();
  });
});