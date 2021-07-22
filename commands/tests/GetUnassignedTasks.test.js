const GetUnassignedTasks = require("../unassignedTasks");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const label = 'bug'

const server = setupServer(
    rest.get(`${API}issue/${owner}/${repo}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
          [{number : 1, title: "test1", assignees: []},
          {number : 2, title: "test2", assignees: []},
          {number : 3, title: "test3", assignees: [{name: "Alice"}]}]
      ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns unassigned tasks", async() => {
    const content = await GetUnassignedTasks([],  repo, owner);

    expect(content).toBe("There are a total of 2 unassigned issues:\n1 test1,\n2 test2.");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}issue/${owner}/${repo}`, (req, res, ctx) => {
      return res(ctx.status(404))})
  );

  await expect(GetUnassignedTasks([], repo, owner)).rejects.toThrow("404");
});
