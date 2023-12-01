import React from "react";
import Image from "next/image";
import mercedies from "../../public/images/mercedes.png";
import plainYellow from "../../public/images/planyellow.svg";
const BookCar = () => {
  const ourServices = [
    {
      img: plainYellow,
      title: "Book A Ride",
      description:
        "We pride ourselves in always going the extra mile for our customers.",
    },
    {
      img: plainYellow,
      title: "Hire A Car",
      description:
        "you hirethe best luxury cars across the world at a affordable price.",
    },
    {
      img: plainYellow,
      title: "Hire A Driver",
      description:
        "you want to travel and fell confortable , our drivers are available.",
    },
  ];
  return (
    <div className=" mt-[24px] max-sm:mt-[40px] flex justify-center items-center flex-col">
      <div className=" flex flex-col items-center  bg-[#C4C4C4] w-[832px] h-[248px] max-sm:w-[384px] max-sm:h-[180px]">
        <h2 className=" text-2xl font-bold text-[#081630] mb-6 mt-11 max-sm:mb-1 max-sm:mt-1 max-sm:font-medium max-sm:text-sm">
          Book your drean car now!
        </h2>
        <p className=" text-center text-base p-5">
          Rent a car online now from one of our worldwide locations. With
          over 20 years’ experience in luxury car and customer services, all we
          need is your ID and you can book any car.
        </p>
      </div>
      <div className=" flex flex-row max-sm:flex-col justify-between mt-[103px] max-sm:mx-2">
        <div className=" w-[817px] h-[485px] max-md:w-[456px] max-md:h-[270px] max-sm:w-[233px] max-sm:h-[137px]">
          <Image src={mercedies} alt="car" width={600} height={385} />
        </div>
        <div>
          <h1 className=" mt-[30px] text-[#21408E] font-semibold text-[45px] mb-4">
            Our Services
          </h1>
          {ourServices.map((item, index) => {
            return (
              <div className="flex flex-row mb-5" key={index}>
              <Image
                src={item.img}
                alt="icon"
                width={80}
                height={60}
                className=" max-md:w-[67px] max-md:h-[51px] max-sm:w-[30px] max-sm:h-[24px] mr-4"
              />
              <span className="">
                <p>
                  <em className=" text-[20px] font-normal">{item.title}</em>{" "}
                  <br />
                  {item.description}
                </p>
              </span>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default BookCar;
