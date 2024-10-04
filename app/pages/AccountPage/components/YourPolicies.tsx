import React, { useState } from "react";
import { closestTimeUnit } from "../../../utils";
import useModal from "../../../hooks/useModal";
import RequestClaimModal from "./RequestClaimModal";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAccount, useReadContract } from "wagmi";
import contractDefinitions from "../../../contracts";
import { zeroAddress } from "viem";
import useWeb3 from "../../../contexts/web3context";

export default function YourPolicies() {
  const [viewMore, setViewMore] = useState(false);
  const modal = useModal();
  const [parent] = useAutoAnimate();
  const { address } = useAccount();
  // const { policies } = useWeb3();

  const { data: balance } = useReadContract({
    ...contractDefinitions.surecoin,
    functionName: "balanceOf",
    args: [address || zeroAddress],
  });

  return (
    <div className="flex flex-col p-page">
      <div
        ref={parent}
        className="flex mt-4 gap-y-2 flex-col p-6 rounded-lg bg-secondary/10 border border-border/20 mobile:p-2"
      >
        <div className="flex justify-between m-4 items-center">
          <div>
            <h1 className="text-2xl font-semibold">Policies Owned</h1>
            <h2 className=" text-mute font-semibold">
              Here are the policies owned by you..
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-mono font-semibold">
              SureCoin: {balance?.toString()}
            </p>
            <button className="bg-primary text-back text-sm opacity-80 hover:opacity-100 duration-100 ease-in px-4 border border-border py-2 font-bold rounded-lg">
              Withdraw
            </button>
          </div>
        </div>

        {policies.map(
          (policy, key) =>
            (viewMore || key < 2) && (
              <div
                className="bg-background m-2 rounded-lg flex flex-col p-8 border border-border/50 "
                key={key}
              >
                <div className="flex gap-x-4">
                  <img
                    src={policy.logoUrl}
                    className="w-[5vw] rounded-full h-max mobile:w-[15vw]"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-wide">
                      {policy.name}
                    </h1>
                    <p className="text-sm mt-1 font-light text-front/90">
                      {policy.description}
                    </p>
                    <div className="mt-2 self-end text-end w-full">
                      {policy.boughtAt + policy.duration - Date.now() < 0 ? (
                        <>
                          <p>
                            {" "}
                            Status:{" "}
                            {policy.claimed ? (
                              <span className="text-green-600">Claimed</span>
                            ) : (
                              <span className="text-red-600">Expired</span>
                            )}
                          </p>

                          <p className="">
                            Policy expired{" "}
                            <span className="text-red-500">
                              {closestTimeUnit(
                                Date.now() - policy.duration - policy.boughtAt,
                              )}{" "}
                            </span>
                            ago{" "}
                          </p>
                        </>
                      ) : (
                        <div className="flex justify-between ">
                          <button
                            className="mt-2 bg-background hover:bg-zinc-900 border transition-all border-border px-4 py-2 text-back font-bold rounded-lg text-sm w-max mobile:self-end"
                            onClick={() => modal.show(<RequestClaimModal />)}
                          >
                            Request Claim
                          </button>
                          <div className="flex flex-col">
                            <p className="text-sm">
                              Status:{" "}
                              <span className="text-orange-600">Ongoing</span>
                            </p>
                            <p className="text-sm mt-1">
                              Time Left:{" "}
                              {closestTimeUnit(
                                policy.boughtAt + policy.duration - Date.now(),
                              )}{" "}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
        )}
        {policies.length > 2 && (
          <button
            className="bg-background mr-2 hover:bg-zinc-900 border transition-all border-border w-max px-4 py-2 self-end text-back font-bold rounded-lg"
            onClick={() => setViewMore(!viewMore)}
          >
            {viewMore ? "View Less" : "View More"}{" "}
          </button>
        )}
      </div>
    </div>
  );
}

const policies = [
  {
    name: "Home Insurance",
    marketer: "Insure",
    logoUrl:
      "https://png.pngtree.com/element_our/png/20181214/real-estate-house-logo-graphic-design-template-vector-illustration-png_269514.jpg",
    description:
      "Protect your home sweet home with our comprehensive home insurance coverage. From fire and theft to natural disasters and liability protection, our policies offer peace of mind knowing that your biggest investment is safeguarded. With customizable coverage options and dedicated customer support, we're here to ensure that your home remains a safe haven for you and your family.",
    boughtAt: 1029710000000,
    duration: 6848420000010,
    claimApproved: false,
    claimed: true,
  },
  {
    name: "Home Insurance",
    marketer: "Insure",
    logoUrl:
      "https://png.pngtree.com/element_our/png/20181214/real-estate-house-logo-graphic-design-template-vector-illustration-png_269514.jpg",
    description:
      "Protect your home sweet home with our comprehensive home insurance coverage. From fire and theft to natural disasters and liability protection, our policies offer peace of mind knowing that your biggest investment is safeguarded. With customizable coverage options and dedicated customer support, we're here to ensure that your home remains a safe haven for you and your family.",
    boughtAt: 1029710000000,
    duration: 68484200000,
    claimApproved: false,
    claimed: true,
  },
  {
    name: "Home Insurance",
    marketer: "Insure",
    logoUrl:
      "https://png.pngtree.com/element_our/png/20181214/real-estate-house-logo-graphic-design-template-vector-illustration-png_269514.jpg",
    description:
      "Protect your home sweet home with our comprehensive home insurance coverage. From fire and theft to natural disasters and liability protection, our policies offer peace of mind knowing that your biggest investment is safeguarded. With customizable coverage options and dedicated customer support, we're here to ensure that your home remains a safe haven for you and your family.",
    boughtAt: 1029710000000,
    duration: 6848420000010,
    claimApproved: false,
    claimed: true,
  },
];
