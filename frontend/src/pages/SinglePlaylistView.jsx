import React, { useEffect } from "react";

const SinglePlaylistView = () => {
  return (
    <>
      <div class="h-screen overflow-y-auto bg-[#121212] text-white">
        <div class="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
            <div class="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
              <div class="w-full shrink-0 sm:max-w-md xl:max-w-sm">
                <div class="relative mb-2 w-full pt-[56%]">
                  <div class="absolute inset-0">
                    <img
                      src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="React Mastery"
                      class="h-full w-full"
                    />
                    <div class="absolute inset-x-0 bottom-0">
                      <div class="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                        <div class="relative z-[1]">
                          <p class="flex justify-between">
                            <span class="inline-block">Playlist</span>
                            <span class="inline-block">12 videos</span>
                          </p>
                          <p class="text-sm text-gray-200">
                            100K Views · 2 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h6 class="mb-1 font-semibold">React Mastery</h6>
                <p class="flex text-sm text-gray-200">
                  Master the art of building dynamic user interfaces with React.
                </p>
                <div class="mt-6 flex items-center gap-x-3">
                  <div class="h-16 w-16 shrink-0">
                    <img
                      src="https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="React Patterns"
                      class="h-full w-full rounded-full"
                    />
                  </div>
                  <div class="w-full">
                    <h6 class="font-semibold">React Patterns</h6>
                    <p class="text-sm text-gray-300">757K Subscribers</p>
                  </div>
                </div>
              </div>
              <div class="flex w-full flex-col gap-y-4">
                <div class="border">
                  <div class="w-full max-w-3xl gap-x-4 sm:flex">
                    <div class="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                      <div class="w-full pt-[56%]">
                        <div class="absolute inset-0">
                          <img
                            src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="JavaScript Fundamentals: Variables and Data Types"
                            class="h-full w-full"
                          />
                        </div>
                        <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                          20:45
                        </span>
                      </div>
                    </div>
                    <div class="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                      <div class="h-10 w-10 shrink-0 sm:hidden">
                        <img
                          src="https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                          alt="codemaster"
                          class="h-full w-full rounded-full"
                        />
                      </div>
                      <div class="w-full">
                        <h6 class="mb-1 font-semibold sm:max-w-[75%]">
                          JavaScript Fundamentals: Variables and Data Types
                        </h6>
                        <p class="flex text-sm text-gray-200 sm:mt-3">
                          10.3k Views · 44 minutes ago
                        </p>
                        <div class="flex items-center gap-x-4">
                          <div class="mt-2 hidden h-10 w-10 shrink-0 sm:block">
                            <img
                              src="https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                              alt="codemaster"
                              class="h-full w-full rounded-full"
                            />
                          </div>
                          <p class="text-sm text-gray-200">Code Master</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SinglePlaylistView;
