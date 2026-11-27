// import moment from "moment";
// import React from "react";
// import { useWebsocketUser } from "../../../context/webSocketUser";
// import IBet from "../../../models/IBet";
// import { RoleType } from "../../../models/User";
// import {
//   selectPlaceBet,
//   setBetCount,
//   setbetlist,
//   setBookMarketList,
// } from "../../../redux/actions/bet/betSlice";
// import { selectUserData } from "../../../redux/actions/login/loginSlice";
// import { selectCurrentMatch } from "../../../redux/actions/sports/sportSlice";
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
// import { betDateFormat } from "../../../utils/helper";
// import { isMobile } from "react-device-detect";
// import { selectCasinoCurrentMatch } from "../../../redux/actions/casino/casinoSlice";
// import { useLocation } from "react-router-dom";
// import accountService from "../../../services/account.service";

// const MyBetComponent22 = () => {
//   const [getMyAllBet, setMyAllBet] = React.useState<IBet[]>([]);

//   const getPlaceBet = useAppSelector(selectPlaceBet);
//   const getCurrentMatch = useAppSelector(selectCurrentMatch);
//   const getCasinoCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
//   const userState = useAppSelector(selectUserData);
//   const { socketUser } = useWebsocketUser();
//   const dispatch = useAppDispatch();
//   const [betRefresh, setRefreshStatus] = React.useState<any>(false);
//   const location = useLocation();
//   React.useEffect(() => {
//     // console.log(getCurrentMatch,"hello world here is Match id")
//     //console.log(getCasinoCurrentMatch?.match_id," getCasinoCurrentMatch hello world here is Match id")

//     if (
//       (getCurrentMatch &&
//         getCurrentMatch.matchId &&
//         location.pathname.includes("/odds")) ||
//       (getCasinoCurrentMatch && getCasinoCurrentMatch.match_id)
//     ) {
//       const dataMatchId: any =
//         getCurrentMatch &&
//         getCurrentMatch.matchId &&
//         location.pathname.includes("/odds")
//           ? getCurrentMatch.matchId
//           : getCasinoCurrentMatch && getCasinoCurrentMatch?.event_data?.match_id
//           ? getCasinoCurrentMatch?.event_data?.match_id
//           : 0;
//       //console.log("hello world match");
//       accountService
//         .getBets22(dataMatchId)
//         .then((bets) => {
//           //console.log(bets.data, "chech bet dataggfgf");
//           bets &&
//             bets.data &&
//             bets.data.data &&
//             setMyAllBet(bets.data.data.bets);
//           // dispatch(setbetlist(bets.data.data.bets))
//           // dispatch(setBookMarketList(bets.data.data.odds_profit))
//           // dispatch(setBetCount(bets.data.data.bets.length))
//         })
//         .catch((e) => {
//           console.log(e.stack);
//         });
//     }
//   }, [getCurrentMatch, getCasinoCurrentMatch, betRefresh]);

//   // ✅ Group bets by selectionName
//   const groupedMyAllBet =
//     getMyAllBet?.reduce((acc: any, bet: any) => {
//       const key = bet.selectionName || "Unknown";
//       if (!acc[key]) acc[key] = [];
//       acc[key].push(bet);
//       return acc;
//     }, {}) || {};

//   React.useEffect(() => {
//     if (getPlaceBet.bet.marketId) {
//       //setMyAllBet([{ ...getPlaceBet.bet }, ...getMyAllBet])
//       setRefreshStatus(betRefresh ? false : true);
//     }
//   }, [getPlaceBet.bet]);

//   React.useEffect(() => {
//     socketUser.on("placedBet", (bet: IBet) => {
//       ///setMyAllBet([bet, ...getMyAllBet])
//       setRefreshStatus(betRefresh ? false : true);
//     });
//     return () => {
//       socketUser.off("placedBet");
//     };
//   }, [getMyAllBet]);

//   React.useEffect(() => {
//     socketUser.on("betDelete", ({ betId }) => {
//       ///setMyAllBet(getMyAllBet.filter((bet: IBet) => bet._id !== betId))
//       setRefreshStatus(betRefresh ? false : true);
//       ///dispatch(setBookMarketList({}))
//     });
//     return () => {
//       socketUser.off("betDelete");
//     };
//   }, [getMyAllBet]);

//   return (
//     <>
//      <h6 className="p-2 w-100 m-0 bg-info text-white text-center">
//             Declared Bets
//           </h6>
//       {getMyAllBet?.length > 0 && ( 

//         <div
//           className="table-responsive-new"
//           style={{ height: "200px", overflowY: "scroll" }}
//         >

//           <table className="table coupon-table scorall mybet">
//             <thead>
//               <tr style={{ background: "#76d68f" }}>
//                 <th> Sr. </th>
//                 {userState.user.role !== RoleType.user && <th>Username</th>}
//                 <th className="text-center"> Narration</th>
//                 <th> Rate</th>
//                 <th> Amount</th>
//                 <th> Run</th>
//                 <th> Mode</th>

//                 {/* {!isMobile && <th style={{background:"#76d68f"}}> Place Date</th>} */}
//                 {/* {!isMobile && <th style={{background:"#76d68f"}}> Match Date</th>} */}
//                 <th className="text-center"> Dec</th>
//                 <th>Date</th>
//               </tr>
//             </thead>

//             <tbody className="scorall">
//               {Object.keys(groupedMyAllBet).map(
//                 (runnerName: string, groupIndex: number) => (
//                   <React.Fragment key={runnerName}>
//                     {/* Group Header Row */}
//                     <tr>
//                       <td
//                         colSpan={8}
//                         style={{
//                           backgroundColor: "rgb(17, 40, 62)",
//                           color: "white",
//                           padding: "8px 10px",
//                           textAlign: "left",
//                         }}
//                       >
//                         {runnerName}
//                       </td>
//                     </tr>

//                     {/* Grouped Bets */}
//                     {groupedMyAllBet[runnerName]?.map(
//                       (bet: any, index: number) => (
//                         <tr
//                           key={bet._id}
//                           className={
//                             Number(bet.profitLoss?.$numberDecimal) < 0
//                               ? "bg-danger text-white"
//                               : "bg-success"
//                           }
//                         >
//                           <td className="no-wrap">{index + 1}</td>
//                           {userState.user.role !== RoleType.user && (
//                             <td>{bet?.userName}</td>
//                           )}

//                           <td className="no-wrap">
//                             {bet?.selectionName} /{" "}
//                             {bet?.marketName === "Fancy" &&
//                             bet.gtype !== "fancy1"
//                               ? bet.volume.toFixed(2)
//                               : (bet.odds * 100 - 100).toFixed(2)}
//                           </td>

//                           <td className="no-wrap text-center">
//                             {bet.marketName === "Fancy" &&
//                             bet.gtype !== "fancy1"
//                               ? bet.volume.toFixed(2)
//                               : (bet.odds * 100 - 100).toFixed(2)}
//                           </td>

//                           <td className="no-wrap">
//                             {Math.abs(
//                               Number(bet?.profitLoss?.$numberDecimal)
//                             ).toFixed(2)}
//                           </td>

//                           <td className="no-wrap text-center">
//                             {bet.marketName === "Fancy" &&
//                             bet.gtype !== "fancy1"
//                               ? bet.odds
//                               : "-"}
//                           </td>

//                           <td className="no-wrap text-center">
//                             {bet.isBack ? "Yes" : "No"}
//                           </td>

//                           <td className="no-wrap text-center">
//                             {bet?.result?.result ? bet?.result?.result : "YES"}
//                           </td>

//                           <td className="no-wrap">
//                             {moment
//                               .utc(bet.betClickTime)
//                               .format("DD/MM/YYYY hh:mm:ss A")}
//                           </td>
//                         </tr>
//                       )
//                     )}
//                   </React.Fragment>
//                 )
//               )}
//             </tbody>

//           </table>
//         </div>
//    )}
//     </>
//   );
// };

// export default MyBetComponent22;



// import moment from "moment-timezone";
// import React from "react";
// import { useWebsocketUser } from "../../../context/webSocketUser";
// import IBet from "../../../models/IBet";
// import { RoleType } from "../../../models/User";
// import {
//   selectPlaceBet,
//   setBetCount,
//   setbetlist,
//   setBookMarketList,
// } from "../../../redux/actions/bet/betSlice";
// import { selectUserData } from "../../../redux/actions/login/loginSlice";
// import { selectCurrentMatch } from "../../../redux/actions/sports/sportSlice";
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
// import betService from "../../../services/bet.service";
// import { selectCasinoCurrentMatch } from "../../../redux/actions/casino/casinoSlice";
// import { useLocation } from "react-router-dom";
// import accountService from "../../../services/account.service";

// const MyBetComponent22 = () => {
//   const [bets, setBets] = React.useState<IBet[]>([]);
//   const getPlaceBet = useAppSelector(selectPlaceBet);
//   const getCurrentMatch = useAppSelector(selectCurrentMatch);
//   const getCasinoCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
//   const userState = useAppSelector(selectUserData);
//   const { socketUser } = useWebsocketUser();
//   const dispatch = useAppDispatch();
//   const [refresh, setRefresh] = React.useState(false);
//   const location = useLocation();

//   interface Decimal128 {
//     $numberDecimal: string;
//   }

//   interface Bet {
//     profitLoss: number | Decimal128;
//   }





//   /* ================= FETCH BETS ================= */
//   React.useEffect(() => {
//     const matchId =
//       getCurrentMatch?.matchId && location.pathname.includes("/odds")
//         ? getCurrentMatch.matchId
//         : getCasinoCurrentMatch?.event_data?.match_id;

//     if (!matchId) return;

//     accountService.getBets22(matchId).then((res) => {
//       const data = res?.data?.data;
//       setBets(data?.bets || []);
//       dispatch(setbetlist(data?.bets || []));
//       dispatch(setBookMarketList(data?.odds_profit || {}));
//       dispatch(setBetCount(data?.bets?.length || 0));
//     });
//   }, [getCurrentMatch, getCasinoCurrentMatch, refresh]);

//   React.useEffect(() => {
//     if (getPlaceBet.bet.marketId) setRefresh((p) => !p);
//   }, [getPlaceBet.bet]);

//   React.useEffect(() => {
//     const handler = () => setRefresh((p) => !p);

//     socketUser.on("placedBet", handler);

//     return () => {
//       socketUser.off("placedBet", handler);
//     };
//   }, []);


//   /* ================= SPLIT BETS ================= */
//   const matchBets = bets.filter((b: any) => b.bet_on === "MATCH_ODDS");
//   const fancyBets = bets.filter((b: any) => b.bet_on !== "MATCH_ODDS");

//   const groupedFancy = fancyBets.reduce((acc: any, bet: IBet) => {
//     const key = bet.selectionName || "Fancy";
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(bet);
//     return acc;
//   }, {});

//   /* ================= TABLE UI ================= */
//   const TableHead = () => (
//     <thead>
//       <tr style={{ background: "#76d68f" }}>
//         <th className="p-2">Sr</th>
//         {/* {userState.user.role !== RoleType.user && <th className="p-2">User</th>} */}
//         <th className="p-2">Narration</th>
//         <th className="p-2">Rate</th>
//         <th className="p-2">Amount</th>
//         <th className="p-2">Mode</th>
//         {/* <th className="p-2">Dec</th> */}
//       </tr>
//     </thead>
//   );

//   const TableHeadTwo = ({ runnerName }: { runnerName: string }) => (
//     <thead>
//       <tr style={{ background: "#76d68f" }}>
//         <th className="p-2">Sr</th>
//         <th className="p-2">{runnerName}</th>
//         <th className="p-2">Rate</th>
//         <th className="p-2">Amount</th>
//         <th className="p-2">Mode</th>
//         <th className="p-2">Dec</th>
//       </tr>
//     </thead>
//   );

//   const th: React.CSSProperties = {
//     padding: "3px",
//     textAlign: "center",
//     border: "1px solid #ddd",
//     fontWeight: 600,
//     wordBreak: "break-word",
//     whiteSpace: "normal",   // ⭐ wrap allow
//   };

//   const td: React.CSSProperties = {
//     padding: "3px",
//     textAlign: "center",
//     border: "1px solid #ddd",
//     wordBreak: "break-word",   // ⭐ text break
//     whiteSpace: "normal",      // ⭐ wrap
//   };



//   return (
//     <div className="table-responsive-new" style={{ maxHeight: 400, overflowY: "auto" }}>
//       <h6 className="p-2 w-100 m-0 bg-info text-white text-center">
//         Declared Bets
//       </h6>
//       {/* ================= MATCH ODDS TABLE ================= */}
//       {matchBets.length > 0 && (
//         <table
//           className="coupon-table mybet"
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             fontSize: "11px",
//             marginBottom: "8px",
//           }}
//         >
//           <thead>
//             <tr style={{ background: "#76d68f" }}>
//               <th style={th}>Sr</th>
//               <th style={th}>Team</th>
//               <th style={th}>Rate</th>
//               <th style={th}>Amount</th>
//               <th style={th}>Mode</th>
//               {/* <th style={th}>Dec</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {matchBets.map((bet, i) => (
//               <tr key={bet._id} className={bet.isBack ? "back" : "lay"}>
//                 <td style={td}>{i + 1}</td>
//                 <td style={td}>{bet.selectionName}</td>
//                 <td style={td}>{(bet.odds * 100 - 100).toFixed()}</td>
//                 <td style={td}>{bet.stack}</td>
//                 <td style={td}>{bet.isBack ? "LAGAI" : "KHAI"}</td>
//                 {/* <td style={td}>{bet?.result?.result || "YES"}</td> */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* ================= FANCY TABLE ================= */}
//       {Object.keys(groupedFancy).map((runner) => (
//         <table
//           key={runner}
//           className="coupon-table mybet"
//           style={{
//             width: "100%",
//             tableLayout: "fixed",      // ⭐ MOST IMPORTANT
//             borderCollapse: "collapse",
//             fontSize: "10px",          // chhota font
//             marginBottom: "10px",
//           }}
//         >

//           <thead>
//             <tr style={{ background: "#76d68f" }}>
//               <th style={th}>Sr</th>
//               <th style={th}>{runner}</th>
//               <th style={th}>Rate</th>
//               <th style={th}>Amount</th>
//               <th style={th}>Run</th>
//               <th style={th}>Mode</th>
//               {/* <th style={th}>P/L</th> */}
//               <th style={th}>Dec</th>
//             </tr>
//           </thead>

//           <tbody>
//             {groupedFancy[runner].map((bet: IBet, i: number) => (
//               <tr key={bet._id} className={bet.isBack ? "back" : "lay"}>
//                 <td style={td}>{i + 1}</td>
//                 <td style={td}>{bet.selectionName}</td>
//                 <td style={td}>
//                   {bet.gtype === "fancy1"
//                     ? bet.odds.toFixed(2)
//                     : bet.volume.toFixed(2)}
//                 </td>
//                 <td style={td}>{bet.stack}</td>
//                 <td style={td}>{bet.odds}</td>
//                 <td style={td}>{bet.isBack ? "YES" : "NO"}</td>
//                 {/* <td style={td}>
//                   {typeof bet.profitLoss === "number"
//                     ? bet.profitLoss
//                     : "Number(bet.profitLoss.$numberDecimal)"}
//                 </td> */}

//                 <td style={td}>{bet?.result?.result || "No"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ))}

//     </div>
//   );
// };

// export default MyBetComponent22;




import React from "react";
import { useLocation } from "react-router-dom";

import { useWebsocketUser } from "../../../context/webSocketUser";
import IBet from "../../../models/IBet";

import {
  selectPlaceBet,
  setBetCount,
  setBookMarketList,
} from "../../../redux/actions/bet/betSlice";

import { selectCurrentMatch } from "../../../redux/actions/sports/sportSlice";
import { selectCasinoCurrentMatch } from "../../../redux/actions/casino/casinoSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks";

import accountService from "../../../services/account.service";

/* ================= TYPES ================= */

type DeclaredBet = Omit<IBet, "profitLoss"> & {
  profitLoss?: unknown;
  bet_on?: string;
};

/* ================= PROFIT LOSS PARSER ================= */

const parseProfitLoss = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  let amount: number;

  if (typeof value === "number") {
    amount = value;
  } else if (typeof value === "string") {
    amount = Number(value);
  } else if (
    typeof value === "object" &&
    "$numberDecimal" in value
  ) {
    const decimalValue = (
      value as { $numberDecimal: unknown }
    ).$numberDecimal;

    amount = Number(decimalValue);
  } else {
    return null;
  }

  return Number.isFinite(amount) ? amount : null;
};

/* ================= COMPONENT ================= */

const MyBetComponent22 = () => {
  const [bets, setBets] = React.useState<DeclaredBet[]>([]);
  const [refresh, setRefresh] = React.useState(false);

  const getPlaceBet = useAppSelector(selectPlaceBet);
  const getCurrentMatch = useAppSelector(selectCurrentMatch);
  const getCasinoCurrentMatch = useAppSelector(
    selectCasinoCurrentMatch
  );

  const { socketUser } = useWebsocketUser();
  const dispatch = useAppDispatch();
  const location = useLocation();

  /* ================= MATCH ID ================= */

  const matchId =
    getCurrentMatch?.matchId &&
    location.pathname.includes("/odds")
      ? getCurrentMatch.matchId
      : getCasinoCurrentMatch?.event_data?.match_id;

  /* ================= FETCH DECLARED BETS ================= */

  React.useEffect(() => {
    if (!matchId) {
      setBets([]);
      return;
    }

    let active = true;

    accountService
      .getBets22(matchId)
      .then((res) => {
        if (!active) return;

        const data = res?.data?.data;

        const betList: DeclaredBet[] =
          Array.isArray(data?.bets) ? data.bets : [];

        setBets(betList);

        // Removed: setbetlist(betList)
        // Redux expects FancyBook, not DeclaredBet[].

        // dispatch(
        //   setBookMarketList(data?.odds_profit || {})
        // );

        dispatch(setBetCount(betList.length));
      })
      .catch((error) => {
        if (active) {
          console.error(
            "Declared bets fetch error:",
            error
          );
        }
      });

    return () => {
      active = false;
    };
  }, [matchId, refresh, dispatch]);

  /* ================= BET REFRESH ================= */

  React.useEffect(() => {
    if (getPlaceBet.bet?.marketId) {
      setRefresh((prev) => !prev);
    }
  }, [getPlaceBet.bet]);

  /* ================= WEBSOCKET ================= */

  React.useEffect(() => {
    if (!socketUser) return;

    const handler = () => {
      setRefresh((prev) => !prev);
    };

    socketUser.on("placedBet", handler);

    return () => {
      socketUser.off("placedBet", handler);
    };
  }, [socketUser]);

  /* ================= SPLIT BETS ================= */

  const isMatchOdds = (bet: DeclaredBet): boolean => {
    return (
      (bet.bet_on ?? bet.betOn) === "MATCH_ODDS"
    );
  };

  const matchBets = bets.filter(isMatchOdds);

  const fancyBets = bets.filter(
    (bet) => !isMatchOdds(bet)
  );

  /*
    GROUPING REMOVED

    All fancy bets now display individually
    using fancyBets.map().

    No groupedFancy reduce().
  */

  /* ================= PROFIT LOSS ================= */

  const getPL = (bet: DeclaredBet): number | null => {
    return parseProfitLoss(bet.profitLoss);
  };

  const validPLValues = bets
    .map((bet) => getPL(bet))
    .filter(
      (value): value is number => value !== null
    );

  const totalPL = validPLValues.reduce(
    (total, amount) => total + amount,
    0
  );

  const hasPL = validPLValues.length > 0;

  const missingPLCount =
    bets.length - validPLValues.length;

  const formatPL = (value: number | null): string => {
    if (value === null) return "-";

    const formatted = Math.abs(value).toFixed(2);

    if (value > 0) return `+${formatted}`;
    if (value < 0) return `-${formatted}`;

    return "0.00";
  };

  /* ================= THEME ================= */

  const theme = {
    background:
      "radial-gradient(at 80% 0%, rgba(201, 137, 21, 0.12), transparent 60%), linear-gradient(145deg, rgb(23, 20, 14) 0%, rgb(6, 7, 8) 55%, rgb(16, 13, 9) 100%)",

    border: "1.5px solid rgb(217, 162, 52)",

    gold: "rgb(217, 162, 52)",
    text: "#ffffff",
    green: "#4ade80",
    red: "#ff6464",
  };

  /* ================= TABLE STYLES ================= */

  const th: React.CSSProperties = {
    padding: "8px 5px",
    textAlign: "center",
    background: theme.background,
    border: theme.border,
    color: theme.gold,
    fontWeight: 700,
    fontSize: "11px",
    whiteSpace: "normal",
    wordBreak: "break-word",
  };

  const td: React.CSSProperties = {
    padding: "8px 5px",
    textAlign: "center",
    background: theme.background,
    border: theme.border,
    color: theme.text,
    fontSize: "11px",
    whiteSpace: "normal",
    wordBreak: "break-word",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    background: theme.background,
    border: theme.border,
    marginBottom: "12px",
  };

  /* ================= MODE STYLE ================= */

  const modeStyle = (
    isBack: boolean
  ): React.CSSProperties => ({
    ...td,
    color: isBack ? theme.green : theme.red,
    fontWeight: 800,
  });

  /* ================= PROFIT LOSS STYLE ================= */

  const plStyle = (
    value: number | null
  ): React.CSSProperties => ({
    ...td,
    color:
      value === null
        ? theme.gold
        : value > 0
        ? theme.green
        : value < 0
        ? theme.red
        : theme.text,
    fontWeight: 800,
  });

  /* ================= UI ================= */

  return (
    <div
      className="table-responsive-new declared-golden-bets"
      style={{
        maxHeight: 400,
        overflowY: "auto",
        background: theme.background,
        border: theme.border,
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      {/* ================= HEADING ================= */}

      <h6
        style={{
          margin: "0 0 12px",
          padding: "11px",
          textAlign: "center",
          background: theme.background,
          color: theme.gold,
          border: theme.border,
          borderRadius: "5px",
          fontSize: "14px",
          fontWeight: 800,
          letterSpacing: "1px",
        }}
      >
        DECLARED BETS
      </h6>

      {/* ================= MATCH ODDS ================= */}

      {matchBets.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            className="coupon-table mybet"
            style={{
              ...tableStyle,
              minWidth: "480px",
            }}
          >
            <thead>
              <tr>
                <th style={th}>Sr</th>
                <th style={th}>Team</th>
                <th style={th}>Rate</th>
                <th style={th}>Amount</th>
                <th style={th}>Mode</th>
                <th style={th}>P/L</th>
              </tr>
            </thead>

            <tbody>
              {matchBets.map((bet, i) => {
                const pl = getPL(bet);

                return (
                  <tr key={bet._id}>
                    <td style={td}>{i + 1}</td>

                    <td style={td}>
                      {bet.selectionName}
                    </td>

                    <td style={td}>
                      {(
                        Number(bet.odds) * 100 -
                        100
                      ).toFixed(0)}
                    </td>

                    <td style={td}>
                      {bet.stack}
                    </td>

                    <td style={modeStyle(bet.isBack)}>
                      {bet.isBack
                        ? "LAGAI"
                        : "KHAI"}
                    </td>

                    <td style={plStyle(pl)}>
                      {formatPL(pl)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= FANCY BETS ================= */}

      {fancyBets.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            className="coupon-table mybet"
            style={{
              ...tableStyle,
              minWidth: "650px",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                <th style={th}>Sr</th>
                <th
                  style={{
                    ...th,
                    width: "22%",
                  }}
                >
                  Narration
                </th>
                <th style={th}>Rate</th>
                <th style={th}>Amount</th>
                <th style={th}>Run</th>
                <th style={th}>Mode</th>
                <th style={th}>Dec</th>
                <th style={th}>P/L</th>
              </tr>
            </thead>

            <tbody>
              {fancyBets.map((bet, i) => {
                const pl = getPL(bet);

                return (
                  <tr key={bet._id}>
                    <td style={td}>
                      {i + 1}
                    </td>

                    <td style={td}>
                      {bet.selectionName}
                    </td>

                    <td style={td}>
                      {bet.gtype === "fancy1"
                        ? Number(bet.odds).toFixed(2)
                        : Number(bet.volume).toFixed(2)}
                    </td>

                    <td style={td}>
                      {bet.stack}
                    </td>

                    <td style={td}>
                      {bet.odds}
                    </td>

                    <td style={modeStyle(bet.isBack)}>
                      {bet.isBack ? "YES" : "NO"}
                    </td>

                    <td style={td}>
                      {bet?.result?.result || "No"}
                    </td>

                    <td style={plStyle(pl)}>
                      {formatPL(pl)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TOTAL PROFIT LOSS ================= */}

      {bets.length > 0 && (
        <div
          style={{
            background: theme.background,
            border: theme.border,
            borderRadius: "6px",
            padding: "12px",
            marginTop: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              color: theme.gold,
              fontWeight: 800,
              fontSize: "13px",
            }}
          >
            TOTAL PROFIT / LOSS
          </span>

          <span
            style={{
              color: !hasPL
                ? theme.gold
                : totalPL > 0
                ? theme.green
                : totalPL < 0
                ? theme.red
                : theme.text,
              fontWeight: 900,
              fontSize: "17px",
            }}
          >
            {hasPL ? formatPL(totalPL) : "-"}
          </span>
        </div>
      )}

      {/* ================= MISSING P/L ================= */}

      {missingPLCount > 0 && bets.length > 0 && (
        <div
          style={{
            padding: "7px 3px",
            color: theme.gold,
            fontSize: "10px",
          }}
        >
          {missingPLCount} bet(s) have no valid P/L.
          Total includes available values only.
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {bets.length === 0 && (
        <div
          style={{
            padding: "25px",
            textAlign: "center",
            color: theme.gold,
            fontSize: "12px",
          }}
        >
          No Declared Bets Found
        </div>
      )}
    </div>
  );
};

export default MyBetComponent22;


