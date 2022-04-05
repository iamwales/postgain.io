const { assert } = require("chai");

const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("SocialNetwork", ([deployer, author, tipper]) => {
  let socialNetwork;

  before(async () => {
    socialNetwork = await SocialNetwork.deployed();
  });

  describe("deployment", async () => {
    it("deploys successful", async () => {
      const address = await socialNetwork.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const hasAName = await socialNetwork.name();

      assert.equal(hasAName, "Wales is here");
    });
  });

  describe("post", async () => {
    let result, postCount;

    before(async () => {
      result = await socialNetwork.createPost("This is my first Post", {
        from: author,
      });
      postCount = await socialNetwork.postCount();
    });

    it("create posts", async () => {
      // SUCCESS
      assert.equal(postCount, 1);

      const event = result.logs[0].args;
      assert(event.id.toNumber(), postCount.toNumber(), "Id is correct");
      assert(event.content, "This is my first Post", "content is correct");
      assert(event.tipAmount, 0, "Tip is correct");
      assert(event.author, author, "author is correct");

      // FAILURE: Post must have content
      await socialNetwork.createPost("", { from: author }).should.be.rejected;
    });

    it("list post", async () => {
      const post = await socialNetwork.posts(postCount);

      assert(post.id.toNumber(), postCount.toNumber(), "Id is correct");
      assert(post.content, "This is my first Post", "content is correct");
      assert(post.tipAmount, 0, "Tip is correct");
      assert(post.author, author, "author is correct");
    });

    // it("allows users to tip post", async () => {
    //   // TODO: Fill me in
    // });
  });
});
