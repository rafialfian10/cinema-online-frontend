export async function getCategories() {
  const response = await fetch("http://localhost:5000/api/v1/categories", {
    cache: "no-store",
    // next: {revalidate: 3600}
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data categories");
  }

  await wait(1000);
  const categories = await response.json();

  return {
    props: {
      data: categories,
    },
  };
}

export async function getCategory(id: number) {
  const response = await fetch(`http://localhost:5000/api/v1/category/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("failed to fetch category");
  }

  await wait(1000);
  return response.json();
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
