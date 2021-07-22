const GetIssueAssignees= require("../issueAssignees");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const issue_num = 1

const server = setupServer(
    rest.get(`${API}issue/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
          {title: 'issue1', assignees: [{login: 'alice'}]}
      ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("gets issue assignee", async() => {
    const content = await GetIssueAssignees([issue_num], repo, owner);

    expect(content).toBe("Here are the 1 assignees assgined to (#1) issue1: alice.");
});

test("gets issue assignees", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                {title: 'issue1', assignees: [{login: 'alice'}, {login: 'bob'}]}
            ))}));
    const content = await GetIssueAssignees([issue_num],  repo, owner);

    expect(content).toBe("Here are the 2 assignees assgined to (#1) issue1: alice, bob.");
});

test("zero assignee issues", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                 {title: 'issue1', assignees: []}
            ))}));
    const content = await GetIssueAssignees([issue_num],  repo, owner);

    expect(content).toBe("There are no assignees assigned to 1.");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}issue/${owner}/${repo}/${issue_num}`, (req, res, ctx) => {
      return res(ctx.status(404))})
  );

  await expect(GetIssueAssignees([issue_num], repo, owner)).rejects.toThrow("404");
});
