import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationData {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from: number;
  to: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  links: Link[];
}

interface Props {
  data: PaginationData;
}

export default function InvitationPagination({ data }: Props) {
  const { links, current_page, last_page, prev_page_url, next_page_url } = data;

  // Don't show pagination if there's only one page
  if (last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {data.from || 0} to {data.to || 0} of {data.total} results
      </div>
      <Pagination>
        <PaginationContent>
          {prev_page_url && (
            <PaginationItem>
              <PaginationPrevious href={prev_page_url} />
            </PaginationItem>
          )}
          
          {links && links.slice(1, -1).map((link, index) => {
            if (link.label === '...') {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={index}>
                <PaginationLink 
                  href={link.url || '#'} 
                  isActive={link.active}
                >
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {next_page_url && (
            <PaginationItem>
              <PaginationNext href={next_page_url} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
