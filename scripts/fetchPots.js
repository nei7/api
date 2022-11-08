await fetch("https://api.github.com/repos/nei7/personal-page/contents/posts", {
  method: "GET",
  headers: {
    "content-type": "application/json",
    "user-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
  },
})
  .then((res) => res.json())
  .then((posts) => {
    fs.writeFileSync(
      path.join(__dirname, "src", "api", "posts.json"),
      JSON.stringify(posts.map((post) => post.name.replace(".md", "")))
    );
  })
  .catch((err) => console.log(err));
