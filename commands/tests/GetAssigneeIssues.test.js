const GetAssigneeIssues = require("../assigneeIssues");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const assignee = 'Alice'

const server = setupServer(
    rest.get(`${API}issue/${owner}/${repo}/assignee/${assignee}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
          [{title: 'issue1', number: 1}]
      ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("gets assignee issue", async() => {
    const content = await GetAssigneeIssues([assignee],  repo, owner);

    expect(content).toBe("Here are the 1 issues assigned to Alice: (1) issue1.");
});

test("gets assignee issues", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/assignee/${assignee}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                [{title: 'issue1', number: 1},
                        {title: 'issue2', number: 2}]
            ))}));
    const content = await GetAssigneeIssues([assignee],  repo, owner);

    expect(content).toBe("Here are the 2 issues assigned to Alice: (1) issue1, (2) issue2.");
});

test("zero assignee issues", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/assignee/${assignee}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                 []
            ))}));
    const content = await GetAssigneeIssues([assignee],  repo, owner);

    expect(content).toBe("There are no open issues assigned to Alice.");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}issue/${owner}/${repo}/assignee/${assignee}`, (req, res, ctx) => {
      return res(ctx.status(404))})
  );

  await expect(GetAssigneeIssues([assignee], repo, owner)).rejects.toThrow("404");
});
