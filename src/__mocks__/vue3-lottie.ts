module.exports = {
  LottieAnimation: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    stop: jest.fn(),
  })),
};