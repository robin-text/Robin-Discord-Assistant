const GetIssuesWithLabel = require("../issuesWithLabel");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const label = 'bug'

const server = setupServer(
    rest.get(`${API}issue/${owner}/${repo}/labeled/${label}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(
          [{title: 'issue1', number: 1}]
      ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("gets issue with label", async() => {
    const content = await GetIssuesWithLabel([label],  repo, owner);

    expect(content).toBe("Here are the 1 issues labeled with bug: (1) issue1.");
});

test("gets multiple issues with label", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/labeled/${label}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                [{title: 'issue1', number: 1},
                        {title: 'issue2', number: 2}]
            ))}));
    const content = await GetIssuesWithLabel([label],  repo, owner);

    expect(content).toBe("Here are the 2 issues labeled with bug: (1) issue1, (2) issue2.");
});

test("zero issues with label", async() => {
    server.use(
        rest.get(`${API}issue/${owner}/${repo}/labeled/${label}`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(
                []
            ))}));
    const content = await GetIssuesWithLabel([label],  repo, owner);

    expect(content).toBe("There are no open issues labeled with bug.");
});

test("handles failure", async() => {
  server.use(
    rest.get(`${API}issue/${owner}/${repo}/labeled/${label}`, (req, res, ctx) => {
      return res(ctx.status(404))})
  );

  await expect(GetIssuesWithLabel([label], repo, owner)).rejects.toThrow("404");
});
