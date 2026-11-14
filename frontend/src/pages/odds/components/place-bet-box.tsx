import React, { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { shallowEqual } from "react-redux";
import {
  betPopup,
  selectBetCount,
  selectBetPopup,
  selectPlaceBet,
  setBetCount,
} from "../../../redux/actions/bet/betSlice";
import { IUserBetStake } from "../../../models/IUserStake";
import IBet, { IBetOn, IBetType } from "../../../models/IBet";
import { getPlaceBetAction } from "../../../redux/actions/bet/bet.action";
import { IApiStatus } from "../../../models/IApiStatus";
import { useWebsocketUser } from "../../../context/webSocketUser";
import { OddsType } from "../../../models/IMarket";
import userService from "../../../services/user.service";
import { AxiosResponse } from "axios";
import { setBalance } from "../../../redux/actions/balance/balanceSlice";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

const PlaceBetBox = ({ stake }: { stake: IUserBetStake }) => {
  //console.log(stake,"stake")
  const [betObj, setBetObj] = React.useState<IBet>({} as IBet);
  const betValues = useAppSelector(selectBetPopup, shallowEqual);
  const getPlaceBet = useAppSelector(selectPlaceBet, shallowEqual);
  const betCount = useAppSelector(selectBetCount);
  const { socketUser } = useWebsocketUser();

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    setBetObj({
      ...betValues.betData,
      odds:
        typeof betValues.betData.odds === "string"
          ? parseFloat(betValues.betData.odds)
          : betValues.betData.odds,
    });
  }, [betValues.betData]);

  React.useEffect(() => {
    if (getPlaceBet.status === IApiStatus.Done) {
      socketUser.emit("place-bet", getPlaceBet.bet);
      // dispatch(setBookMarketList({}))
      dispatch(betPopup({ isOpen: false, betData: {} as IBet }));
      dispatch(setBetCount(betCount + 1));
      userService.getUserBalance().then((res: AxiosResponse) => {
        dispatch(setBalance(res.data.data));
      });
    }
  }, [getPlaceBet.status]);

  const reset = () => {
    setBetObj({ ...betObj, stack: 0, pnl: 0 });
    dispatch(
      betPopup({
        ...betValues,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      })
    );
  };

  const onStack = (stack: number) => {
    const betObjItem = { ...betObj };
    betObjItem.stack = betObjItem.stack + stack;
    const calPnl = calculatePnlF(betObjItem);

    betObjItem.pnl = calPnl.pnl;
    betObjItem.exposure = calPnl.exposure;
    setBetObj(betObjItem);
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }));
  };

  const incrementDecrementOdds = (type = "inc") => {
    const betObjItem = { ...betObj };

    if (
      betObjItem.oddsType === OddsType.BM ||
      betObjItem.oddsType === OddsType.F
    ) {
      return true;
    }
    switch (type) {
      case "inc":
        betObjItem.odds = parseFloat((betObjItem.odds + 0.01).toFixed(4));
        break;
      case "dec":
        betObjItem.odds = parseFloat((betObjItem.odds - 0.01).toFixed(4));
        break;
    }
    const calPnl = calculatePnlF(betObjItem);
    betObjItem.pnl = calPnl.pnl;
    betObjItem.exposure = calPnl.exposure;
    betObjItem.type =
      betObjItem.odds !== betObjItem.currentMarketOdds
        ? IBetType.UnMatch
        : IBetType.Match;
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }));

    setBetObj(betObjItem);
  };

  const calculatePnlF = (betValue: IBet) => {
    let pnl = 0,
      exposure = 0;
    if (Object.keys(betValue).length > 0) {
      if (betValue.betOn == IBetOn.MATCH_ODDS || betValue.gtype === "fancy1") {
        if (betValue.isBack) {
          pnl = betValue.odds * betValue.stack - betValue.stack;
          exposure = -1 * betValue.stack;
        } else {
          pnl = betValue.stack;
          exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
        }
      } else if (betValue.betOn != IBetOn.CASINO) {
        if (betValue.isBack) {
          pnl = (betValue.volume * betValue.stack) / 100;
          exposure = -betValue.stack;
        } else {
          exposure = -((betValue.volume * betValue.stack) / 100);
          pnl = betValue.stack;
        }
      } else if (betValue.betOn == IBetOn.CASINO) {
        if (betValue.matchId == 33) {
          //// specific condition for cmeter game
          pnl = 0;
          exposure = -50 * betValue.stack * 1.0;
        } else if (betValue.matchId == 9) {
          //// specific condition for tp1day game
          if (betValue.isBack) {
            pnl = (betValue.odds / 100) * betValue.stack;
            exposure = -betValue.stack;
          } else {
            pnl = betValue.stack;
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
          }
        } else if (betValue.fancystatus == "yes") {
          //// specific condition for cmeter game
          if (betValue.isBack) {
            pnl = (betValue.volume * betValue.stack) / 100;
            exposure = -betValue.stack;
          } else {
            exposure = -((betValue.volume * betValue.stack) / 100);
            pnl = betValue.stack;
          }
        } else {
          if (betValue.isBack) {
            pnl = betValue.odds * betValue.stack - betValue.stack;
            exposure = -1 * betValue.stack;
          } else {
            pnl = betValue.stack;
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
          }
        }
      }
    }
    return {
      pnl: parseInt(pnl.toFixed()),
      exposure: parseInt(exposure.toFixed()),
    };
  };

  const onChangeStack = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetObj({ ...betObj, stack: parseInt(e.target.value) });
  };

  const onBlurStack = () => {
    onStack(0);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(getPlaceBetAction(betObj));
  };

  // const renderStakeButtons = () => {
  //   const buttons = []
  //   for (let i = 1; i <= 11; i++) {
  //     buttons.push(
  //       <button
  //         key={i}
  //         type='button'
  //         onClick={() => onStack(stake[`value${i}`])}
  //         className='btn btn-secondary m-1 '
  //       >
  //         {stake[`name${i}`]}
  //       </button>,
  //     )
  //   }
  //   return buttons
  // }

  const renderStakeButtons = () => {
    const rows = [];

    for (let i = 1; i <= 13; i += 3) {
      rows.push(
        <div className="row justify-content-center" key={`row-${i}`}>
          {[0, 1, 2].map((offset) => {
            const index = i + offset;
            if (index > 11 && betValues?.betData?.betOn !== "MATCH_ODDS") {
              return null;
            }
            if (index > 13) return null;
            return (
              // <div className="col-4 d-flex justify-content-center" key={`btn-${index}`}>
              //   <button
              //     type="button"
              //     onClick={() => onStack(stake[`value${index}`])}
              //     className="btn btn-secondary m-1 w-100"
              //   >
              //     {stake[`name${index}`]}
              //   </button>
              // </div>
              <div
                className="col-4 d-flex justify-content-center"
                key={`btn-${index}`}
              >
                <button
                  type="button"
                  onClick={() => onStack(stake[`value${index}`])}
                  className="btn btn-secondary p-3 m-1 w-100"
                  style={{
                    fontSize: "1.4rem", // text को बड़ा बनाता है
                    fontWeight: "bold", // text को bold करता है
                    textAlign: "center", // text center में
                    height: "35px", // button height बड़ा
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                   
                    borderRadius: "8px",
                  }}
                >
                  {stake[`name${index}`]}
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    return rows;
  };

  const [seconds, setSeconds] = React.useState<number>(700);

  React.useEffect(() => {
    if (
      !betValues.isOpen ||
      ["CASINO", "MATKA"].includes(betValues.betData?.betOn)
    ) {
      return;
    }
    setSeconds(700); // Reset timer to 7 on open

    const interval: NodeJS.Timeout = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop interval
          closeBetPopup(); // Auto-close popup
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [betValues.isOpen, betValues.betData?.betOn]); // Only run on open

  const closeBetPopup = () => {
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      })
    );
  };
  const onBackDrop = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      })
    );
  };
  //betValues.isOpen
  //console.log(betValues, "hajdd");

  //console.log("place bet re render ");
 
return (
  <>
    {betValues.isOpen && (
      <>
        <div
          className="golden-bet-backdrop"
          onClick={onBackDrop}
        />

        <div
          className="golden-bet-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Place Bet"
        >
          <div className="golden-bet-header">
            <div>
              <h3>
                {betObj.selectionName || "Place Bet"}
              </h3>
              <span>PLACE BET</span>
            </div>

            <div className="golden-bet-header-right">
              {!["CASINO", "MATKA"].includes(
                betValues.betData?.betOn
              ) && (
                <span className="golden-bet-timer">
                  {seconds}s
                </span>
              )}

              <button
                type="button"
                className="golden-bet-close"
                onClick={closeBetPopup}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="golden-bet-body">
              {/* RATE */}

              <div className="golden-bet-rate-row">
                <label>Rate :</label>

                <div className="golden-bet-rate">
                  {Number(betObj.odds || 0).toFixed(2)}
                </div>
              </div>

              {/* STAKE INPUT */}

              <div className="golden-bet-stake-row">
                <label htmlFor="golden-stake">
                  Amount
                </label>

                <input
                  id="golden-stake"
                  type="number"
                  min="1"
                  required
                  value={betObj.stack || ""}
                  onChange={onChangeStack}
                  onBlur={onBlurStack}
                  placeholder="Enter Amount"
                />
              </div>

              {/* STAKE BUTTONS */}

              <div className="golden-bet-stakes">
                {Array.from(
                  {
                    length:
                      betValues?.betData?.betOn ===
                      "MATCH_ODDS"
                        ? 13
                        : 11,
                  },
                  (_, i) => i + 1
                ).map((index) => {
                  const stakeValue = Number(
                    stake[
                      `value${index}` as keyof IUserBetStake
                    ]
                  );

                  const stakeName = String(
                    stake[
                      `name${index}` as keyof IUserBetStake
                    ] ?? ""
                  );

                  return (
                    <button
                      key={index}
                      type="button"
                      className="golden-stake-btn"
                      onClick={() => {
                        if (
                          Number.isFinite(stakeValue) &&
                          stakeValue > 0
                        ) {
                          onStack(stakeValue);
                        }
                      }}
                    >
                      {stakeName}
                    </button>
                  );
                })}
              </div>

              {/* ACTION BUTTONS */}

              <div className="golden-bet-actions">
                <button
                  type="button"
                  className="golden-cancel-btn"
                  onClick={reset}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="golden-submit-btn"
                  disabled={
                    getPlaceBet.status ===
                    IApiStatus.Loading
                  }
                >
                  {getPlaceBet.status ===
                  IApiStatus.Loading
                    ? "Please wait..."
                    : "Place Bet"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    )}
  </>
);

};
export default React.memo(PlaceBetBox);
