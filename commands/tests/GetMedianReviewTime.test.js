const GetMedianReviewTime = require("../medianReviewTime");
const {rest} = require("msw");
const {setupServer} = require("msw/node");
const { default: axios } = require("axios");
const API = 'https://robinrestapi.herokuapp.com/';
const owner = "John"
const repo = "TestRepo"
const dateParsed = "2021-05-09"

const server = setupServer(
    rest.get(`${API}pr/${owner}/${repo}/${dateParsed}/1`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json( 
            {total_count: 2, items: [{created_at: "2021-05-09T13:10:23Z", closed_at: "2021-05-10T13:10:23Z"}, 
            {created_at: "2021-06-09T13:10:23Z", closed_at: "2021-06-10T13:10:23Z"}]}
        ))}));

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test("returns a median review time", async() => {
    const content = await GetMedianReviewTime([undefined, undefined, "2021-05-09", 1],  repo, owner);

    expect(content).toBe(
    `For pull requests closed since 2021-05-09, the median pull request time was 1.0 days, or 24.00 hours`);
});

test("returns no time because there aren't any PRs", async() => {
    server.use(
        rest.get(`${API}pr/${owner}/${repo}/${dateParsed}/1`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json( 
                {total_count: 0}
              ))}));
    const content = await GetMedianReviewTime([undefined, undefined, "2021-05-09", 1],  repo, owner);

    expect(content).toBe("No pull requests have been closed since 2021-05-09");
});

test("handles failure", async() => {
    server.use(
        rest.get(`${API}pr/${owner}/${repo}/${dateParsed}/1`, (req, res, ctx) => {
            return res(ctx.status(404))})
    );
  
    await expect(GetMedianReviewTime([undefined, undefined, "2021-05-09", 1],  repo, owner)).rejects.toThrow("404");
  });