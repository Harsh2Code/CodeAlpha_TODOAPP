import React from 'react'

function Dashboard() {
    return (
        <div>
            <div className="w-xs mx-auto mb-8">
                <h1 className="text-5xl font-bold text-stone-50 text-center">Welcome to <i className="text-sky-400">PowerFlow</i></h1>
                <p className="text-gray-400 text-center my-5">
                    Streamline your project management with our comprehensive platform <br /> featuring todo lists, team collaboration, and project flow tracking.
                </p>
                <span className='flex flex-row justify-center'>
                    <button className="btn btn-primary px-8 p-3 rounded-md mx-2 font-bold">Get Started</button>
                    <button className="btn btn-soft px-8 p-3 rounded-md mx-2 font-bold">View More</button>
                </span>
            </div>
            <div className='grid grid-cols-1 mt-8 md:grid-cols-3 gap-8 pt-8 mb-16 w-5/6 mx-auto'>
                <div className="bg-gray-800 rounded-lg shadow-sm text-center border border-gray-700">
                    <div className="card-body">
                        <i className="ri-checkbox-circle-line text-center text-4xl p-3 px-0 rounded-[50%] mx-auto text-sky-400 bg-blue-800 w-[70px]"></i>
                        <h2 className="card-title">Card title!</h2>
                        <p className="text-left">A card component has a figure, a body part, and inside body there are title and actions parts</p>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-sm text-center border border-gray-700">
                    <div className="card-body">
                        <i className="ri-notification-3-line text-center text-4xl p-3 px-0 rounded-[50%] mx-auto text-green-400 bg-green-800 w-[70px]"></i>
                        <h2 className="card-title">Card title!</h2>
                        <p className="text-left">A card component has a figure, a body part, and inside body there are title and actions parts</p>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-sm text-center border border-gray-700">
                    <div className="card-body">
                        <i className="ri-team-line text-center text-4xl p-3 px-0 rounded-[50%] mx-auto text-violet-400 bg-violet-800 w-[70px]"></i>
                        <h2 className="card-title">Card title!</h2>
                        <p className="text-left">A card component has a figure, a body part, and inside body there are title and actions parts</p>
                    </div>
                </div>

            </div>
            <div className="grid grid-cols-1 mt-1 mx-auto md:grid-cols-2 gap-8 w-5/6  mb-[4rem]">
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
                    <h3 className="text-2xl font-semibold text-white mb-4 ">Project Flow Tracking</h3>
                    <p className="text-gray-400 mb-6 text-start">Visualize your project progress with our intuitive flow tracking system. See what's complete, what's in progress, and what's next in the pipeline.</p>
                    <ul className="space-y-3 text-gray-400">
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Real-time progress tracking
                        </li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Visual project timelines
                        </li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Milestone tracking</li>
                    </ul>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-5">
                    <h3 className="text-2xl font-semibold text-white mb-4 ">Collaborative Features</h3>
                    <p className="text-gray-400 mb-6">Work seamlessly with your team using our built-in collaboration tools designed to keep everyone on the same page.</p>
                    <ul className="space-y-3 text-gray-400">
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>Team-wide notifications</li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Task assignment system
                        </li>
                        <li className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-3">
                                <i className="ri-check-line text-green-400"></i>
                            </div>
                            Project activity feeds
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dashboard