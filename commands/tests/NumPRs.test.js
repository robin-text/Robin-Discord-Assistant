const NumPRs = require("../NumPRs");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"

const server = setupServer(
    rest.get(`${API}pr/${owner}/${repo}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({
          total_count: 4,
      }))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("gets count for PRs", async() => {
    const content = await NumPRs([],  repo, owner);

    expect(content).toBe(`The number of open pull requests in ${repo} is 4`);
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}pr/${owner}/${repo}`, (req, res, ctx) => {
      return res(ctx.status(404))})
  );

  await expect(NumPRs([],  repo, owner)).rejects.toThrow("404");
});
