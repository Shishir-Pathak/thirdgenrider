import React from 'react'

const TopSection = ({data}) => {
  return (
    <section className="bg-[url(https://media.istockphoto.com/id/1190475811/photo/rush-in-the-city.webp?a=1&b=1&s=612x612&w=0&k=20&c=pgEobykYrVwHxzRyCKixA6TSA4wh4yCyj_aY9TuqLm4=)] bg-no-repeat bg-cover bg-centre h-[350px] py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white text-5xl font-bold mb-3 tracking-wider">
            {data.title}
          </p>
          <p className="text-white text-lg pt-6">
            {data.breadcrumb}
          </p>

        </div>
      </section>
  )
}

export default TopSection
