export const getServices = jest.fn().mockReturnValue({
  xsuaa: { tag: "mocked-service" },
  hana: 'test'
});

export const loadEnv = jest.fn().mockReturnValue({});
