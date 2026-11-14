// import React, { Fragment } from 'react'
// import LMatch from '../../../models/LMatch'
// import moment from 'moment'
// import { dateFormat } from '../../../utils/helper'
// import { useLocation } from 'react-router-dom'

// const MatchListMobile = (props: any) => {
//   const location = useLocation()

//   return (
//     <div
//       className='card-content mobile-match'
//       style={
//         location.pathname.includes('in-play') ? { maxHeight: '300px', overflowY: 'scroll' } : {}
//       }
//     >

//       <table className='table coupon-table coupon-table-mobile'>
//         <tbody>
//           {props.matchList.length > 0 ? (
//             props.matchList.map((match: LMatch, index: number) => {
//               const marketId =
//                 match?.markets && match?.markets?.length > 0 ? match?.markets[0].marketId : null
//               return (
//                 <Fragment key={match.matchId}>
//                   <tr>
//                     <td colSpan={4}>
//                       <div className='game-name'>
//                         <a
//                           onClick={() => props.currentMatch(match)}
//                           className='text-edark'
//                           href={undefined}
//                         >
//                           {match.name}
//                         </a>


//                                    <p className='tx-666 tx-12' style={{ marginTop: '3px' }}>
//                                                   {moment(match?.matchDateTime).format(dateFormat)}
//                                                   {/* {match.seriesId} */}
//                                                 </p>


//                         {/* <p className='tx-666 tx-12' style={{ marginTop: '3px' }}>
//                           {moment(match.matchDateTime).format(dateFormat)}
//                         </p> */}
//                       </div>
//                     </td>
//                     <td colSpan={2}>
//                       <div className='game-icons' style={{ paddingRight: '0px' }}>
//                         {new Date(match.matchDateTime).getTime() < new Date().getTime() && (
//                           <span className='game-icon'>
//                             <i className='fas fa-circle v-m icon-circle tx-green' />
//                           </span>
//                         )}
//                         <span className='game-icon'>
//                           <i className='fas fa-tv v-m icon-tv' />
//                         </span>
//                         {match.isFancy && (
//                           <span className='game-icon'>
//                             <img
//                               src='https://dzm0kbaskt4pv.cloudfront.net/v2/static/front/img/icons/ic_fancy.png'
//                               className='fancy-icon'
//                             />
//                           </span>
//                         )}
//                         {match.isBookMaker && (
//                           <span className='game-icon'>
//                             <img
//                               src='https://dzm0kbaskt4pv.cloudfront.net/v2/static/front/img/icons/ic_bm.png'
//                               className='bookmaker-icon'
//                             />
//                           </span>
//                         )}
//                         {match.isT10 && (
//                           <span className='game-icon'>
//                             <img
//                               src='imgs/game-icon.svg'
//                               className='bookmaker-icon'
//                               style={{ height: '16px' }}
//                             />
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                   <tr className='min-h-10 '>
//                     <td className='ln10' colSpan={6}>
//                       &nbsp;
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan={2} className='text-center p5 fw-600 tx-12'>
//                       1
//                     </td>
//                     <td colSpan={2} className='text-center p5 fw-600 tx-12'>
//                       X
//                     </td>
//                     <td colSpan={2} className='text-center p5 fw-600 tx-12'>
//                       2
//                     </td>
//                   </tr>
//                   <tr>{props.memoOdds(marketId)}</tr>
//                   <tr className='min-h-10 border-bottom'>
//                     <td className='ln10' colSpan={6}>
//                       &nbsp;
//                     </td>
//                   </tr>
//                   <tr className='min-h-10'>
//                     <td className='ln10' colSpan={6}>
//                       &nbsp;
//                     </td>
//                   </tr>
//                 </Fragment>
//               )
//             })
//           ) : (
//             <tr>
//               <td className='text-center bg-gray p10'>No Match Found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   )
// }
// export default React.memo(MatchListMobile)




import React from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { dateFormat } from "../../../utils/helper";
import { useLocation } from "react-router-dom";
import "./matchlist.css";

interface MatchListMobileProps {
  matchList: LMatch[];
  currentMatch: (match: LMatch) => void;
  memoOdds: (marketId: string | null) => React.ReactNode;
}

const MatchListMobile: React.FC<MatchListMobileProps> = ({
  matchList,
  currentMatch,
  memoOdds,
}) => {
  const location = useLocation();
  const isInPlay = location.pathname.includes("in-play");

  return (
    <section
      className={`star-ml-wrapper ${
        isInPlay ? "star-ml-inplay" : ""
      }`}
      aria-label="Match list"
    >
      {matchList.length === 0 ? (
        <div className="star-ml-empty">
          <i className="fas fa-calendar-times" />
          <span>No Match Found</span>
        </div>
      ) : (
        matchList.map((match :any) => {
          const marketId =
            match.markets?.length > 0
              ? match.markets[0].marketId
              : null;

          const startTime = new Date(
            match.matchDateTime
          ).getTime();

          const isLive =
            Number.isFinite(startTime) &&
            startTime <= Date.now();

          return (
            <article
              className="star-ml-card"
              key={match.matchId}
            >
              <div className="star-ml-card-glow" />

              {/* TOP: Status and date */}
              <div className="star-ml-top">
                <div className="star-ml-top-left">
                  <span
                    className={`star-ml-status ${
                      isLive
                        ? "star-ml-status-live"
                        : "star-ml-status-soon"
                    }`}
                  >
                    {isLive && (
                      <span className="star-ml-live-dot" />
                    )}
                    {isLive ? "LIVE" : "SOON"}
                  </span>

                  <span className="star-ml-sport">
                    <i className="fas fa-trophy" />
                    CRICKET
                  </span>
                </div>

                <time
                  className="star-ml-date"
                  dateTime={String(match.matchDateTime)}
                >
                  <i className="far fa-calendar-alt" />
                  {moment(match.matchDateTime).format(
                    dateFormat
                  )}
                </time>
              </div>

              {/* MATCH NAME */}
              <button
                type="button"
                className="star-ml-match-name"
                onClick={() => currentMatch(match)}
              >
                <i className="fas fa-baseball-ball star-ml-match-icon" />

                <span className="star-ml-match-text">
                  {match.name}
                </span>

                <i className="fas fa-chevron-right star-ml-arrow" />
              </button>

              {/* Market indicators */}
              <div className="star-ml-features">
                <span className="star-ml-feature">
                  <i className="fas fa-tv" />
                  TV
                </span>

                {match.isFancy && (
                  <span className="star-ml-feature">
                    <i className="fas fa-chart-line" />
                    Fancy
                  </span>
                )}

                {match.isBookMaker && (
                  <span className="star-ml-feature">
                    <i className="fas fa-book" />
                    Bookmaker
                  </span>
                )}

                {match.isT10 && (
                  <span className="star-ml-feature">
                    <i className="fas fa-bolt" />
                    T10
                  </span>
                )}
              </div>

              {/* ODDS */}
              {/* <div className="star-ml-odds-section">
                <div className="star-ml-odds-title">
                  <span>MARKET ODDS</span>
                  <span className="star-ml-odds-caption">
                    1 - X - 2
                  </span>
                </div>

                <table className="star-ml-odds-table">
                  <thead>
                    <tr>
                      <th colSpan={2}>1</th>
                      <th colSpan={2}>X</th>
                      <th colSpan={2}>2</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      {marketId ? (
                        memoOdds(marketId)
                      ) : (
                        <td
                          colSpan={6}
                          className="star-ml-unavailable"
                        >
                          Odds Unavailable
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div> */}

              <div className="star-ml-card-bottom-line" />
            </article>
          );
        })
      )}
    </section>
  );
};

export default React.memo(MatchListMobile);
