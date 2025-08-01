import React, { useEffect, useState } from 'react';

// You can create these as separate components in a /components folder
// or keep them here for simplicity.

const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const Card = ({ _id, name, prompt, photoUrl }) => (
  <div className="rounded-xl group relative shadow-card hover:shadow-card-hover card transition-all duration-300 overflow-hidden">
    <img
      className="w-full h-full object-cover" // Changed to h-full for better layout
      src={photoUrl}
      alt={prompt}
    />
    <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md bg-opacity-80 backdrop-blur-sm">
      <p className="text-white text-sm overflow-y-auto max-h-24">{prompt}</p>
      <div className="mt-5 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">
            {name[0].toUpperCase()}
          </div>
          <p className="text-white text-sm">{name}</p>
        </div>
      </div>
    </div>
  </div>
);

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }
  return <h2 className="mt-5 font-bold text-primary text-xl uppercase">{title}</h2>;
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data); // The backend already sorts by newest
        } else {
           throw new Error('Failed to fetch posts from the server.');
        }
      } catch (error) {
        alert(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // The empty dependency array ensures this runs only once when the component mounts

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // Debounce the search to avoid API calls on every keystroke
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Community Showcase</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[600px]">
          Browse through a collection of imaginative and visually stunning images generated by our creative community.
        </p>
      </div>

      <div className="mt-16">
        <label htmlFor="search" className="block text-sm font-medium text-gray-900">
          Search posts by prompt or user name
        </label>
        <input
          id="search"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          onChange={handleSearchChange}
          required
          className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-full p-3"
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <Loader />
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Results for <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards data={searchedResults} title="No Search Results Found" />
              ) : (
                <RenderCards data={allPosts} title="No Posts Yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;