"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export function SavedTweetPaginationFooter({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const pathname = usePathname();

  const showEllipsisAtStart = currentPage > 3;
  const showEllipsisAtEnd = currentPage < totalPages - 2;
  const showEllipsisInMiddle = totalPages > 5;

  const getPageNumbers = () => {
    const pageNumbers = [];

    if (showEllipsisAtStart) {
      pageNumbers.push(1);
      pageNumbers.push("...");
    }

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (showEllipsisAtEnd) {
      if (!showEllipsisInMiddle || currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-end items-center">
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationLink
              href={`${pathname}?page=1`}
              isActive={currentPage === 1}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
              }
            >
              <ChevronsLeft className="h-4 w-4" />
            </PaginationLink>
          )}
          {currentPage > 1 && (
            <PaginationLink
              href={`${pathname}?page=${
                currentPage === 1 ? 1 : currentPage - 1
              }`}
              isActive={currentPage === 1}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          )}

          {/* Ellipsis and page numbers */}
          {getPageNumbers().map((pageNumber, index) => (
            <React.Fragment key={index}>
              {pageNumber === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationItem
                  // isActive={pageNumber === currentPage}
                  key={pageNumber}
                >
                  <PaginationLink
                    href={`${pathname}?page=${pageNumber}`}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )}
            </React.Fragment>
          ))}

          {currentPage < totalPages && (
            <PaginationLink
              href={`${pathname}?page=${currentPage + 1}`}
              isActive={currentPage === currentPage + 1}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          )}
          {currentPage < totalPages && (
            <PaginationLink
              href={`${pathname}?page=${totalPages}`}
              isActive={currentPage === totalPages}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
