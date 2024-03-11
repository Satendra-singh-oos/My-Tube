import React, { useEffect } from "react";
import { Video, VideoAbout } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVideoById } from "../helper/videoapicalls";
import { getVideoByIdSuccess } from "../store/Slice/video.slice";

const VideoPlay = () => {
  const dispactch = useDispatch();
  const { videoId } = useParams();

  useEffect(() => {
    if (videoId) {
      const video = getVideoById({ videoId })
        .then((data) => {
          dispactch(getVideoByIdSuccess(data));
        })
        .catch((err) => console.log(err?.response?.data));
      //  const comments =0
      // const totalComments =0
      // const commentsHasNextPage=false;
      //
    }
  }, [videoId]);

  const currentVideo = useSelector((state) => state.video?.video);

  return (
    <>
      <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
            {currentVideo && currentVideo.length > 0 ? (
              <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
                <div className="col-span-12 w-full">
                  <div className="relative mb-4 w-full pt-[56%]">
                    <div className="absolute inset-0">
                      <Video
                        videoUrl={currentVideo[0].videoFile}
                        thumbnail={currentVideo[0].thumbnail}
                      />
                    </div>
                  </div>
                  {/* Video About Section Title ,Discription ,Total Views, Video Releadsed Data/hour , total Like , Save To Playlist Subscribed/subscribed */}
                  <VideoAbout />
                  <button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
                    <h6 className="font-semibold">573 Comments...</h6>
                  </button>
                  <div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
                    <div className="block">
                      <h6 className="mb-4 font-semibold">573 Comments</h6>
                      <input
                        type="text"
                        className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
                        placeholder="Add a Comment"
                      />
                    </div>
                    <hr className="my-4 border-white" />
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/18148932/pexels-photo-18148932/free-photo-of-woman-reading-book-on-a-bench.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="sarahjv"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            Sarah Johnson · 
                            <span className="text-sm">17 hour ago</span>
                          </p>
                          <p className="text-sm text-gray-200">@sarahjv</p>
                          <p className="mt-3 text-sm">
                            This series is exactly what I&#x27;ve been looking
                            for! Excited to dive into these advanced React
                            patterns. Thanks for putting this together!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/18107025/pexels-photo-18107025/free-photo-of-man-reading-newspaper.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="mikerod"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            Michael Rodriguez · 
                            <span className="text-sm">5 minutes ago</span>
                          </p>
                          <p className="text-sm text-gray-200">@mikerod</p>
                          <p className="mt-3 text-sm">
                            Render props have always been a bit tricky for me.
                            Can&#x27;t wait to see how this series breaks it
                            down. Thanks for sharing!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/18096595/pexels-photo-18096595/free-photo-of-music-on-street.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="emilyt"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            Emily Turner · 
                            <span className="text-sm">1 hour ago</span>
                          </p>
                          <p className="text-sm text-gray-200">@emilyt</p>
                          <p className="mt-3 text-sm">
                            Higher-order components have been a mystery to me
                            for far too long. Looking forward to demystifying
                            them with this series. Thanks!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/18094275/pexels-photo-18094275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="davidc"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            David Chen · 
                            <span className="text-sm">3 hour ago</span>
                          </p>
                          <p className="text-sm text-gray-200">@davidc</p>
                          <p className="mt-3 text-sm">
                            Compound components are a game-changer for UI
                            development. Can&#x27;t wait to learn more about
                            them. Great work on this series!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/13847596/pexels-photo-13847596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="alex_p"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            Alex Parker · 
                            <span className="text-sm">12 hour ago</span>
                          </p>
                          <p className="text-sm text-gray-200">@alex_p</p>
                          <p className="mt-3 text-sm">
                            Controlled vs. uncontrolled components - finally!
                            This topic has always confused me. Thanks for
                            breaking it down!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/7775637/pexels-photo-7775637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="jessicalee"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            Jessica Lee · 
                            <span className="text-sm">5 hour ago</span>
                          </p>
                          <p className="text-sm text-gray-200">@jessicalee</p>
                          <p className="mt-3 text-sm">
                            This series is a goldmine for React developers!
                            Compound components are something I&#x27;ve been
                            eager to master. Thanks for this!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="ryanjax"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            Ryan Jackson · 
                            <span className="text-sm">Just now</span>
                          </p>
                          <p className="text-sm text-gray-200">@ryanjax</p>
                          <p className="mt-3 text-sm">
                            This is exactly what I needed to take my React
                            skills to the next level. Looking forward to diving
                            into the render props section!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                    <div>
                      <div className="flex gap-x-4">
                        <div className="mt-2 h-11 w-11 shrink-0">
                          <img
                            src="https://images.pexels.com/photos/3532552/pexels-photo-3532552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="lauraw"
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <div className="block">
                          <p className="flex items-center text-gray-200">
                            Laura Williams · 
                            <span className="text-sm">1 minutes ago</span>
                          </p>
                          <p className="text-sm text-gray-200">@lauraw</p>
                          <p className="mt-3 text-sm">
                            This series looks amazing! I&#x27;m especially
                            excited to learn more about controlled vs.
                            uncontrolled components. Thanks for sharing!
                          </p>
                        </div>
                      </div>
                      <hr className="my-4 border-white" />
                    </div>
                  </div>
                </div>
                <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="JavaScript Fundamentals: Variables and Data Types"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          20:45
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          JavaScript Fundamentals: Variables and Data Types
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          Code Master
                        </p>
                        <p className="flex text-sm text-gray-200">
                          10.3k Views · 44 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Getting Started with Express.js"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          22:18
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Getting Started with Express.js
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          Express Learner
                        </p>
                        <p className="flex text-sm text-gray-200">
                          11.k Views · 5 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Building a RESTful API with Node.js and Express"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          24:33
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Building a RESTful API with Node.js and Express
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          API Builder
                        </p>
                        <p className="flex text-sm text-gray-200">
                          14.5k Views · 7 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1739854/pexels-photo-1739854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Introduction to React Native"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          19:58
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Introduction to React Native
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          React Native Dev
                        </p>
                        <p className="flex text-sm text-gray-200">
                          10.9k Views · 8 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Creating Custom Hooks in React"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          16:37
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Creating Custom Hooks in React
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          Hook Master
                        </p>
                        <p className="flex text-sm text-gray-200">
                          9.3k Views · 9 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1144260/pexels-photo-1144260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Building Scalable Web Applications with Django"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          32:18
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Building Scalable Web Applications with Django
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          Django Master
                        </p>
                        <p className="flex text-sm text-gray-200">
                          18.9M Views · 12 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1144276/pexels-photo-1144276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Creating Interactive UIs with React and D3"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          29:30
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Creating Interactive UIs with React and D3
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          ReactD3
                        </p>
                        <p className="flex text-sm text-gray-200">
                          20.1k Views · 14 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1144274/pexels-photo-1144274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Node.js Authentication with Passport.js"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          26:58
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Node.js Authentication with Passport.js
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          Passport Pro
                        </p>
                        <p className="flex text-sm text-gray-200">
                          21.2k Views · 15 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1144231/pexels-photo-1144231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Data Visualization with Tableau"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          32:14
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Data Visualization with Tableau
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          Tableau Master
                        </p>
                        <p className="flex text-sm text-gray-200">
                          24.5k Views · 18 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1144250/pexels-photo-1144250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Building Real-Time Applications with Socket.IO"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          27:37
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Building Real-Time Applications with Socket.IO
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          Socket.IO Expert
                        </p>
                        <p className="flex text-sm text-gray-200">
                          25.6k Views · 19 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1115824/pexels-photo-1115824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Advanced CSS: Animations and Transitions"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          31:55
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Advanced CSS: Animations and Transitions
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          CSS Animations
                        </p>
                        <p className="flex text-sm text-gray-200">
                          28.9k Views · 22 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-x-2 border pr-2 md:flex">
                    <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                      <div className="w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/1115808/pexels-photo-1115808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Advanced React Patterns"
                            className="h-full w-full"
                          />
                        </div>
                        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          30:25
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
                      <div className="h-12 w-12 shrink-0 md:hidden">
                        <img
                          src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="reactpatterns"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                      <div className="w-full pt-1 md:pt-0">
                        <h6 className="mb-1 text-sm font-semibold">
                          Advanced React Patterns
                        </h6>
                        <p className="mb-0.5 mt-2 text-sm text-gray-200">
                          React Patterns
                        </p>
                        <p className="flex text-sm text-gray-200">
                          30.1k Views · 1 day ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
};

export default VideoPlay;
