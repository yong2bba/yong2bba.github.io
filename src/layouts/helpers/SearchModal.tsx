import searchData from "../../../.json/search.json";
import React, { useEffect, useState } from "react";
import SearchResult, { type ISearchItem } from "./SearchResult";

type AgentSubmitEvent = SubmitEvent & {
  agentInvoked?: boolean;
  respondWith?: (result: Promise<unknown>) => void;
};

const SearchModal = () => {
  const [searchString, setSearchString] = useState("");

  const normalizedQuery = searchString.trim().toLocaleLowerCase("ko-KR");
  const searchResult = normalizedQuery
    ? (searchData as ISearchItem[]).filter((item) =>
        [
          item.frontmatter.title,
          item.frontmatter.description,
          item.frontmatter.categories?.join(" "),
          item.frontmatter.tags?.join(" "),
          item.content,
        ].some((value) =>
          value?.toLocaleLowerCase("ko-KR").includes(normalizedQuery),
        ),
      )
    : [];

  const webMcpAttributes = {
    toolname: "searchPosts",
    tooldescription:
      "Search Yongjin's public blog posts by title, summary, body, category, or tag.",
    toolautosubmit: "",
  } as React.FormHTMLAttributes<HTMLFormElement>;
  const webMcpParamAttributes = {
    toolparamdescription: "제목, 요약, 본문, 카테고리, 태그에서 찾을 검색어",
  } as React.InputHTMLAttributes<HTMLInputElement>;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nativeEvent = event.nativeEvent as AgentSubmitEvent;
    const result = searchResult.map((item) => ({
      title: item.frontmatter.title,
      description: item.frontmatter.description,
      url: new URL(`/${item.slug}`, window.location.origin).toString(),
      categories: item.frontmatter.categories ?? [],
      tags: item.frontmatter.tags ?? [],
    }));

    if (nativeEvent.agentInvoked && nativeEvent.respondWith) {
      nativeEvent.respondWith(Promise.resolve(result));
      return;
    }

    const firstResult = result[0];
    if (firstResult) window.location.assign(firstResult.url);
  };

  useEffect(() => {
    const searchModal = document.getElementById("searchModal");
    const searchInput = document.getElementById(
      "searchInput",
    ) as HTMLInputElement | null;
    const searchModalOverlay = document.getElementById("searchModalOverlay");
    const searchModalClose = searchModal?.querySelector("[data-search-close]");
    const searchModalTriggers = document.querySelectorAll(
      "[data-search-trigger]",
    );
    let previouslyFocusedElement: HTMLElement | null = null;

    const openSearch = () => {
      if (searchModal?.getAttribute("aria-hidden") === "false") {
        searchInput?.focus();
        return;
      }
      previouslyFocusedElement = document.activeElement as HTMLElement | null;
      searchModal?.removeAttribute("inert");
      searchModal?.classList.add("show");
      searchModal?.setAttribute("aria-hidden", "false");
      searchModalTriggers.forEach((trigger) =>
        trigger.setAttribute("aria-expanded", "true"),
      );
      searchInput?.focus();
    };
    const closeSearch = () => {
      if (searchModal?.getAttribute("aria-hidden") !== "false") return;
      searchInput?.blur();
      searchModal?.classList.remove("show");
      searchModal?.setAttribute("aria-hidden", "true");
      searchModal?.setAttribute("inert", "");
      searchModalTriggers.forEach((trigger) =>
        trigger.setAttribute("aria-expanded", "false"),
      );
      previouslyFocusedElement?.focus();
      previouslyFocusedElement = null;
    };

    searchModalTriggers.forEach((button) =>
      button.addEventListener("click", openSearch),
    );
    searchModalOverlay?.addEventListener("click", closeSearch);
    searchModalClose?.addEventListener("click", closeSearch);

    const handleKeydown = (event: KeyboardEvent) => {
      const isOpen = searchModal?.getAttribute("aria-hidden") === "false";
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        isOpen ? closeSearch() : openSearch();
        return;
      }
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeSearch();
      }
      if (event.key === "Tab" && isOpen && searchModal) {
        const focusableElements = Array.from(
          searchModal.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);
        if (!firstElement || !lastElement) return;

        if (
          event.shiftKey &&
          (document.activeElement === firstElement ||
            !searchModal.contains(document.activeElement))
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === lastElement ||
            !searchModal.contains(document.activeElement))
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      searchModalTriggers.forEach((button) =>
        button.removeEventListener("click", openSearch),
      );
      searchModalOverlay?.removeEventListener("click", closeSearch);
      searchModalClose?.removeEventListener("click", closeSearch);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div
      id="searchModal"
      className="search-modal"
      role="dialog"
      aria-modal="true"
      aria-label="블로그 검색"
      aria-hidden="true"
      inert
    >
      <div
        id="searchModalOverlay"
        className="search-modal-overlay"
        aria-hidden="true"
      />
      <form
        className="search-wrapper"
        role="search"
        onSubmit={handleSubmit}
        {...webMcpAttributes}
      >
        <div className="search-wrapper-header">
          <label htmlFor="searchInput" className="sr-only">
            검색어
          </label>
          <input
            id="searchInput"
            placeholder="글 검색..."
            className="search-wrapper-header-input"
            type="search"
            name="query"
            value={searchString}
            onChange={(event) => setSearchString(event.currentTarget.value)}
            autoComplete="off"
            {...webMcpParamAttributes}
          />
          <button
            type="button"
            className="search-wrapper-close"
            aria-label="검색 닫기"
            data-search-close
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <SearchResult searchResult={searchResult} searchString={searchString} />
        <div className="search-wrapper-footer">
          <span>
            {searchString
              ? `${searchResult.length}개 결과`
              : "검색어를 입력하세요"}
          </span>
          <span>
            <kbd>ESC</kbd> 닫기
          </span>
        </div>
      </form>
    </div>
  );
};

export default SearchModal;
