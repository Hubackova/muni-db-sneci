import React from "react";

type PaginationButtonsProps = {
  setCurrentPage: any;
  ITEMS_PER_PAGE: any;
  currentPage: any;
  rows: any;
};

const PaginationButtons = ({
  setCurrentPage,
  ITEMS_PER_PAGE,
  currentPage,
  rows,
}: PaginationButtonsProps) => {
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
  const buttonsToShow = 10; // Počet tlačítek stránek k zobrazení

  // Výpočet první a poslední stránky v aktuální skupině
  let firstPage = Math.max(1, currentPage - Math.floor(buttonsToShow / 2));
  let lastPage = Math.min(totalPages, firstPage + buttonsToShow - 1);

  // Pokud jsme příliš blízko k začátku, posuňte poslední stránku tak, aby bylo vždy 7 tlačítek
  if (lastPage - firstPage + 1 < buttonsToShow) {
    lastPage = Math.min(
      totalPages,
      lastPage + (buttonsToShow - (lastPage - firstPage + 1))
    );
  }

  // Pokud jsme příliš blízko ke konci, posuňte první stránku tak, aby bylo vždy 7 tlačítek
  if (lastPage - firstPage + 1 < buttonsToShow) {
    firstPage = Math.max(
      1,
      firstPage - (buttonsToShow - (lastPage - firstPage + 1))
    );
  }

  // Funkce pro vykreslení tlačítek stránek v aktuální skupině
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = firstPage; i <= lastPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          title={`${(i - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
            i * ITEMS_PER_PAGE,
            rows.length
          )}`}
          className={i === currentPage ? "pg-btn active" : "pg-btn"}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="pagination">
      <div className="pg-buttons">
        {/* Šipka zpět na předchozí skupinu stránek */}
        {firstPage > 1 && (
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            className="pg-btn"
          >
            &lt;
          </button>
        )}

        {/* Tlačítka stránek v aktuální skupině */}
        {renderPageButtons()}

        {/* Šipka vpřed na další skupinu stránek */}
        {lastPage < totalPages && (
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            className="pg-btn"
          >
            &gt;
          </button>
        )}
      </div>

      <div>
        {`${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
          currentPage * ITEMS_PER_PAGE,
          rows.length
        )} / ${rows.length}`}
      </div>
    </div>
  );
};

export default PaginationButtons;
