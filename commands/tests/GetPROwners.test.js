const GetPROwners = require("../PROwners");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"

const server = setupServer(
    rest.get(`${API}pr/${owner}/${repo}/owners`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
          [{user: {login: 'alice'}}, {user: {login: 'bob'}}]
      ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("gets number of PR owners", async() => {
    const content = await GetPROwners([],  repo, owner);

    expect(content).toBe("Here are the most recent pull request authors: alice, bob.");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}pr/${owner}/${repo}/owners`, (req, res, ctx) => {
      return res(ctx.status(404))})
  );

  await expect(GetPROwners([],  repo, owner)).rejects.toThrow("404");
});
