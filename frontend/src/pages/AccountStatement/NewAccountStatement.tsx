import moment from "moment";
import React, { MouseEvent, useState } from "react";
// import ReactPaginate from 'react-paginate'
import { toast } from "react-toastify";
import accountService from "../../services/account.service";
import { dateFormat } from "../../utils/helper";
import { isMobile } from "react-device-detect";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import { AccoutStatement } from "../../models/AccountStatement";
import { AxiosResponse } from "axios";
import betService from "../../services/bet.service";
import ReactModal from "react-modal";
import BetListComponent from "../../admin-app/pages/UnsetteleBetHistory/bet-list.component";
import { useAppSelector } from "../../redux/hooks";
import { selectLoader } from "../../redux/actions/common/commonSlice";
import ReactPaginate from "react-paginate";
import "./newaccount.css";
import { reverse } from "lodash";
const NewAccountStatement = () => {
  const loadingState = useAppSelector(selectLoader);
  const [accountStmt, setAccountStmt] = React.useState<any>([]);
  const [parseAccountStmt, setparseAccountStmt] = React.useState<any>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [betHistory, setBetHistory] = React.useState<any>({});
  const [selectedStmt, setSelectedStmt] = React.useState<AccoutStatement>(
    {} as AccoutStatement
  );
  const [pageBet, setPageBet] = React.useState(1);
  const [openBalance, setOpenBalance] = React.useState(0);
  const [closeBalance, setCloseBalance] = React.useState(0);
  const [filterdata, setfilterdata] = React.useState<any>({
    startDate: "",
    endDate: "",
    reportType: "All",
  });
  const [page, setPage] = React.useState(0);
  const [currentItems, setCurrentItems] = useState<any>([]);
  const [pageCount, setPageCount] = useState<any>(1);
  const [itemsPerPage] = useState(50);
  // React.useEffect(() => {
  //   const filterObj = filterdata;
  //   filterObj.startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
  //   filterObj.endDate = moment().format("YYYY-MM-DD");
  //   setfilterdata(filterObj);
  //   getAccountStmt(0);
  // }, []);
  // React.useEffect(() => {
  //   const endOffset = itemOffset + itemsPerPage;
  //   setCurrentItems(parseAccountStmt.slice(itemOffset, endOffset));
  //   setPageCount(Math.ceil(parseAccountStmt.length / itemsPerPage));
  // }, [itemOffset, itemsPerPage, parseAccountStmt]);
  React.useEffect(() => {
  const filterObj = {
    ...filterdata,
    startDate: moment().subtract(3, "months").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
  };
  setfilterdata(filterObj);
  // getAccountStmt(1);
}, []);
React.useEffect(() => {
  if (filterdata.startDate && filterdata.endDate) {
    getAccountStmt(1);
  }
}, [filterdata]);
const handlePageClick = (event: any) => {
  const selectedPage = event.selected + 1;
  getAccountStmt(selectedPage);
};
const getAccountStmt = async (pageNumber: number) => {
  try {
    const res = await accountService.getAccountList(pageNumber, filterdata);
    const items = res?.data?.data?.items || [];
    const opening = res?.data?.data?.openingBalance || 0;
    const total = res?.data?.data?.total || 0;
    let baseBalance = opening;
    // 🔥 previous pages ka balance calculate
    if (pageNumber > 1) {
      let prevSum = 0;
      for (let i = 1; i < pageNumber; i++) {
        const prevRes = await accountService.getAccountList(i, filterdata);
        const prevItems = prevRes?.data?.data?.items || [];
        prevSum += prevItems.reduce(
          (acc: number, curr: any) => acc + curr.amount,
          0
        );
      }
      baseBalance = opening + prevSum;
    }
    const formatted = dataformat(items, baseBalance);
    setCurrentItems(formatted);
    setOpenBalance(opening);
    setPage(pageNumber);
    setPageCount(Math.ceil(total / pageSize));
  } catch (e) {
    toast.error("error");
  }
};
  const handleformchange = (event: any) => {
    const filterObj = filterdata;
    filterObj[event.target.name] = event.target.value;
    setfilterdata(filterObj);
  };
  // const handleSubmitform = (event: any) => {
  //   event.preventDefault();
  //   getAccountStmt(0);
  // };
  const createSrNo = (index: number) => {
    return (page - 1) * itemsPerPage || 0 + index + 1;
  };
  const handlePageClickBets = (event: any) => {
    getBetsData(selectedStmt, event.selected + 1);
  };
  React.useEffect(() => {
    if (isOpen) getBetsData(selectedStmt, pageBet);
  }, [selectedStmt, pageBet, isOpen]);
  const getBetsData = (stmt: any, pageNumber: number) => {
    const allBetsid: any = [];
    const allbets = stmt?.allBets || [];
    if (allbets.length > 0) {
      allbets.map((Item: any) => {
        allBetsid.push(Item.betId);
      });
      const betIds = allBetsid;
      betService
        .getBetListByIds(betIds, pageNumber)
        .then((res: AxiosResponse) => {
          setBetHistory(res.data.data);
          setPageBet(pageNumber);
        });
    }
  };
  const getBets = (
    e: MouseEvent<HTMLTableCellElement>,
    stmt: AccoutStatement
  ) => {
    e.preventDefault();
    setSelectedStmt(stmt);
    setPageBet(1);
    setIsOpen(true);
  };
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [pageSize, setPageSize] = useState(50);
  const getAcHtml = () => {
   const groups = new Map<string, { name: string; date: string; items: any[]; total: number }>();
   currentItems.forEach((stmt: any) => {
     if (!stmt?.narration || !stmt?.stmt?.allBets?.length) return;
     const name = String(stmt.narration).split(" /")[0]?.trim() || "Game";
     const date = moment(stmt.stmt?.createdAt || stmt.date).format("YYYY-MM-DD");
     const key = name + date;
     if (!groups.has(key)) groups.set(key, { name, date, items: [], total: 0 });
     const group = groups.get(key)!;
     group.items.push(stmt);
     group.total += Number(stmt.credit) || 0;
   });
   return Array.from(groups.values()).reverse().filter(group =>
     (group.name + " " + group.date).toLowerCase().includes(searchTerm.toLowerCase())
   ).map(group => {
     const first = group.items[0];
     const displayName = group.name.replace(/\s*\(.*?\)\s*$/, "");
     return (
       <button type="button" className="ledger-game-card" key={group.name + group.date}
         onClick={() => setSelectedGroup(group.name + group.date)}>
         <span className="ledger-game-text">
           <span className="ledger-game-date">Start on {moment(first?.stmt?.createdAt || first?.date).format("MMM DD, hh:mm A")}</span>
           <strong>{displayName}</strong>
         </span>
         <span className={"ledger-game-profit " + (group.total < 0 ? "negative" : "")}>{group.total.toFixed(2)}</span>
         <i className="fas fa-arrow-right" aria-hidden="true" />
       </button>
     );
   });
 };
 const getAcHtml22 = () => {
    let closingbalance: number = page === 1 ? openBalance : closeBalance;
    let totalPnl = 0;
    // Extract gameName and date from narration and filter
    // console.log(currentItems,"current Item,")
    const filteredItems = currentItems?.filter((stmt: any) => {
      if (!stmt?.narration) return false;
      const gameName = stmt.narration.split(" /")[0]?.trim();
      const rawDate = moment(stmt.date, "MMM DD, YYYY hh:mm A").format(
        "YYYY-MM-DD"
      );
      return selectedGroup === gameName + rawDate;
    });
    const rows = filteredItems?.map((stmtt: any, index: number) => {
      console.log("stmt",stmtt?.stmt.allBets[0])
      closingbalance = closingbalance + stmtt.amount;
      const pnlString = stmtt?.credit;
      const pnl = parseFloat(pnlString) || 0;
      totalPnl += pnl;
      if (stmtt.narration.length === 0) return null;
      //console.log(filteredItems, "filtered itemss");
      return (
        <tr key={`${stmtt._id}${index}`}>
          <td>
            {stmtt?.stmt?.allBets ?  stmtt?.stmt.allBets[0].narration : stmtt?.stmt.allBets[0].narration}
          </td>
          <td>
            {stmtt?.stmt.allBets[0]?.result?.marketName
              ? stmtt?.stmt.allBets[0]?.result?.marketName
              : stmtt?.stmt.allBets[0]?.result?.selectionId
}
          </td>
          <td>
            {stmtt?.stmt?.allBets ? stmtt?.stmt?.allBets[0]?.result?.odds : ""}
          </td>
          <td>
            {stmtt.stmt?.allBets
              ? stmtt.stmt.allBets.reduce((sum: number, bet: any) => {
                  const stack = parseFloat(bet?.result?.stack) || bet?.result?.betamount;
                  return sum + stack;
                }, 0)
              : ""}
          </td>
          <td>
            {stmtt?.stmt?.allBets[0]
              ? stmtt?.stmt.allBets[0].narration?.match(/,([^\[]+)\[/)?.[1]?.trim()
              : ""}
          </td>
          <td>
            {stmtt?.stmt?.allBets[0]
              ? stmtt?.stmt.allBets[0].narration?.match(/winner:\s*([^,\[\]]+)?/)?.[1]?.trim()
              : ""}
          </td>
          <td>{stmtt?.stmt?.allBets ? stmtt?.credit : ""}</td>
          <td className="green wnwrap d-none">
            {stmtt?.stmt?.allBets ? stmtt.closing : ""}
          </td>
        </tr>
      );
    });
    return (
      <>
        {rows}
        <tr>
          <td colSpan={8}>
            <strong className={`${totalPnl < 0 ? "total2" : "total"}`}>
              You {totalPnl < 0 ? "lost" : "won"} {totalPnl.toFixed(2)} coins
            </strong>
          </td>
        </tr>
      </>
    );
  };
  const dataformat = (response: any, closingbalance: any) => {
    const aryNewFormat: any = [];
    response &&
      response.map((stmt: any, index: number) => {
        closingbalance = closingbalance + stmt.amount;
        aryNewFormat.push({
          _id: stmt._id,
          // eslint-disable-next-line camelcase
          sr_no: index + 1,
          date: moment(stmt.createdAt).format("lll"),
          credit: stmt.amount,
          debit: stmt.amount,
          closing: closingbalance.toFixed(2),
          narration: stmt.narration,
          stmt: stmt,
        });
      });
    return aryNewFormat;
  };
   return (
   <>
     <div className="ledger-screen">
       
       <div className="ledger-filters">
         <label>Show
           <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
             {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
           </select> Entries
         </label>
         <input type="search" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
       </div>
       <main className="ledger-main">
         {selectedGroup ? (
           <div className="ledger-detail">
             <button type="button" className="ledger-back" onClick={() => setSelectedGroup(null)}>← Back</button>
             <h3>{selectedGroup}</h3>
             <div className="table-responsive"><table className="text-center" id="customers1">
               <thead><tr>{["Event ID","Number","Rate","Amount","Status","Result","PL"].map(t => <th key={t}>{t}</th>)}</tr></thead>
               <tbody>{getAcHtml22()}</tbody>
             </table></div>
           </div>
         ) : <div className="ledger-cards">{getAcHtml()}</div>}
         <div className="ledger-pagination">
           <ReactPaginate
             breakLabel="..." nextLabel="Next" previousLabel="Prev"
             onPageChange={handlePageClick} pageRangeDisplayed={3}
             pageCount={pageCount} forcePage={Math.max(0, page - 1)}
             containerClassName="ledger-pages" activeClassName="active"
           />
           <span>Page {Math.max(1,page)} of {Math.max(1,pageCount)}</span>
         </div>
       </main>
      
     </div>
<ReactModal
        isOpen={isOpen}
        onAfterClose={() => setIsOpen(false)}
        onRequestClose={(e: any) => {
          setIsOpen(false);
        }}
        contentLabel="Set Max Bet Limit"
        className={"col-md-12"}
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5>Bets</h5>
            <button
              onClick={() => setIsOpen(false)}
              className="close float-right"
            >
              <i className="fa fa-times-circle"></i>
            </button>
          </div>
          <div className="modal-body">
            {!loadingState && (
              <BetListComponent
                bethistory={betHistory}
                handlePageClick={handlePageClickBets}
                page={page}
                isTrash={false}
              />
            )}
          </div>
        </div>
      </ReactModal>
    </>
  );
};
export default NewAccountStatement;
