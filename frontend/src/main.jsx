import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { AuthLayout } from "./components/index.js";
import {
  Channel,
  Collections,
  Home,
  LikedPage,
  Login,
  MyContent,
  MySubscriptions,
  Signup,
  SinglePlaylistView,
  VideoPlay,
  WatchHistory,
  ChannelVideos,
  ChannelPlaylist,
  ChannelTweets,
  ChannelSubscribers,
} from "./pages/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },

      {
        path: "/watch/:videoId",
        element: (
          <AuthLayout>
            <VideoPlay />
          </AuthLayout>
        ),
      },
      {
        path: "/liked-videos",
        element: (
          <AuthLayout authentication>
            <LikedPage />
          </AuthLayout>
        ),
      },
      {
        path: "/history",
        element: (
          <AuthLayout authentication>
            <WatchHistory />
          </AuthLayout>
        ),
      },
      {
        path: "/my-content",
        element: (
          <AuthLayout authentication>
            <MyContent />
          </AuthLayout>
        ),
      },
      {
        path: "/collections",
        element: (
          <AuthLayout authentication>
            <Collections />
          </AuthLayout>
        ),
      },
      {
        path: "/subscriptions",
        element: (
          <AuthLayout authentication>
            <MySubscriptions />
          </AuthLayout>
        ),
      },
      {
        path: "/playlist/:playlistId",
        element: (
          <AuthLayout authentication>
            <SinglePlaylistView />
          </AuthLayout>
        ),
      },
      {
        path: "/channel/:username",
        element: (
          <AuthLayout authentication>
            <Channel />
          </AuthLayout>
        ),
        children: [
          {
            path: "videos",
            element: (
              <AuthLayout authentication>
                <ChannelVideos />
              </AuthLayout>
            ),
          },
          {
            path: "playlist",
            element: (
              <AuthLayout authentication>
                <ChannelPlaylist />
              </AuthLayout>
            ),
          },
          {
            path: "tweets",
            element: (
              <AuthLayout authentication>
                <ChannelTweets />
              </AuthLayout>
            ),
          },
          {
            path: "subscribed",
            element: (
              <AuthLayout authentication>
                <ChannelSubscribers />
              </AuthLayout>
            ),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);
