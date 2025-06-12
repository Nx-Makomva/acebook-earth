
import { render, screen } from "@testing-library/react";
import Post from "../../components/Post";


describe("Post", () => {
  const basePost = {
    _id: "123",
    content: "This is a test post",
    username: "Max",
    image: [],
    comments: [],
    likes: [],
  };

  test("renders content and username", () => {
    render(<Post post={basePost} />);
    expect(screen.getByText("Max")).toBeInTheDocument();
    expect(screen.getByText("This is a test post")).toBeInTheDocument();
  });

  test("renders LikeButton and CommentSection", () => {
    render(<Post post={basePost} />);
    expect(screen.getByText("LikeButton")).toBeInTheDocument();
    expect(screen.getByText("CommentSection")).toBeInTheDocument();
  });

  test("renders base64 image if image data is provided", () => {
    const imageBuffer = new Uint8Array([72, 101, 108, 108, 111]); // 'Hello'
    const postWithImage = {
      ...basePost,
      image: [
        {
          image: {
            data: { data: imageBuffer },
            contentType: "image/png",
          },
          name: "test image",
        },
      ],
    };

    render(<Post post={postWithImage} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("data:image/png;base64,"));
    expect(img).toHaveAttribute("alt", "test image");
  });

  test("returns null if no content or image", () => {
    const emptyPost = { _id: "123", content: "", image: [] };
    const { container } = render(<Post post={emptyPost} />);
    expect(container.firstChild).toBeNull();
  });

  test("returns null if content is just whitespace and image is missing", () => {
    const whitespacePost = { _id: "123", content: "   ", image: [] };
    const { container } = render(<Post post={whitespacePost} />);
    expect(container.firstChild).toBeNull();
  });
});
