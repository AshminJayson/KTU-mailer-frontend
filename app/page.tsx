"use client";

import { Rubik_Iso } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "sonner";

const rubik = Rubik_Iso({ weight: ["400"], subsets: ["latin"] });
export default function Home() {
    const [valid, setValid] = useState(false);
    const [pristine, setpristine] = useState(true);

    const validateEmail = (email_id: string) => {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (email_id.match(mailformat)) {
            setValid(true);
            setpristine(false);
            return true;
        } else {
            setValid(false);
            return false;
        }
    };

    const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
        const email_id = e.currentTarget.email_id.value;
        validateEmail(email_id);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setpristine(false);
        const email_id = e.currentTarget.email_id.value;
        if (validateEmail(email_id)) {
            console.log(process.env.NEXT_PUBLIC_SERVER_URL);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/subscriber/?email_id=${email_id}`,
                {
                    method: "POST",
                }
            );

            const body = await res.json();
            if (body.message == "user already exists") {
                toast.error("This email is already subscribed", {
                    description: "Please check the SPAM folder of your mail",
                });
            } else {
                toast.success("Email successfully added to subscribers", {
                    description:
                        "Please check the SPAM folder of your email and flag the mail as not SPAM to recieve further notifications",
                });
            }
        } else {
            toast.error("Invalid Email ID");
        }
    };

    return (
        <div className="shadow-[0.5rem_0.5rem_0_black] w-11/12 md:w-4/5 flex flex-col md:flex-row items-center justify-center border-2 px-10 border-black rounded-xl">
            <div className="h-full w-full object-fill">
                <Image
                    src="https://illustrations.popsy.co/amber/app-launch.svg"
                    alt=""
                    width={500}
                    height={500}
                />
            </div>
            <div
                id="subscription-form-container"
                className="p-4 flex flex-col items-center justify-center gap-4 md:max-w-[50%]"
            >
                <h1
                    className={`${rubik.className} text-orange-400 italic text-5xl text-center`}
                >
                    KTU Mailer
                </h1>
                <p className="text-center font-medium">
                    Wanna get the latest KTU notifications delivered straight to
                    your inbox?
                </p>
                <p className="text-center italic">
                    Well, here&apos;s the subscription service just for that,
                    enter you email below and let the service do its thing.
                </p>
                <form
                    onSubmit={handleFormSubmit}
                    onChange={handleFormChange}
                    className="flex flex-col items-center justify-center gap-4"
                >
                    <input
                        name="email_id"
                        placeholder="Email Id:"
                        type="email"
                        // size={2}
                        required
                        className={`${
                            pristine && !valid ? "focus:outline-orange-200" : ""
                        } px-4 py-2 border-2 rounded-lg outline-none ${
                            !pristine &&
                            (valid ? "border-green-600" : "border-red-600")
                        } `}
                    />
                    <button
                        className={`font-bold px-4 py-2  ${
                            valid
                                ? "shadow-[3px_3px_0_black] -translate-y-[2px] bg-orange-400 !text-black"
                                : ""
                        } focus:outline-none border-2 border-black rounded-xl transition-all ease-linear text-orange-400`}
                    >
                        Subscribe
                    </button>
                </form>
            </div>
            <Toaster richColors />
        </div>
    );
}
