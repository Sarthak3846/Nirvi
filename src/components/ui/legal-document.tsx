"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowUp, 
  FileText,
  Home,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalSection {
  title: string;
  content?: string;
  items?: string[];
  subsections?: {
    subtitle: string | null;
    items: string[];
  }[];
}

interface LegalDocumentProps {
  title: string;
  lastUpdated: string;
  introduction?: string;
  sections: LegalSection[];
}

export function LegalDocument({ 
  title, 
  lastUpdated, 
  introduction, 
  sections
}: LegalDocumentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement }>({});

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = window.pageYOffset;
        const docHeight = contentRef.current.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const progress = Math.min(Math.max(scrollPercent * 100, 0), 100);
        
        setReadingProgress(progress);
        setShowScrollTop(scrollTop > 300);

        // Update active section
        const sectionElements = Object.entries(sectionRefs.current);
        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const [sectionId, element] = sectionElements[i];
          if (element && scrollTop >= element.offsetTop - 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchTerm) return sections;
    
    return sections.filter(section => {
      const titleMatch = section.title.toLowerCase().includes(searchTerm.toLowerCase());
      const contentMatch = section.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const itemsMatch = section.items?.some(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const subsectionMatch = section.subsections?.some(subsection =>
        subsection.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subsection.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      return titleMatch || contentMatch || itemsMatch || subsectionMatch;
    });
  }, [sections, searchTerm]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSectionCollapse = (sectionTitle: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionTitle)) {
      newCollapsed.delete(sectionTitle);
    } else {
      newCollapsed.add(sectionTitle);
    }
    setCollapsedSections(newCollapsed);
  };

  const getSectionId = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  return (
    <div className="relative min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted/30 z-50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-500 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>



      <div className="max-w-[100vw] sm:max-w-[95vw] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex lg:gap-4 xl:gap-6 relative">
          {/* Table of Contents - Desktop Sidebar */}
          <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-24 z-30 space-y-4">
              <Card className="shadow-xl border-muted/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                    <BookOpen className="h-3 w-3 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Table of Contents</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-2">
                <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
                  <nav className="space-y-0">
                    {sections.map((section, index) => {
                      const sectionId = getSectionId(section.title);
                      const isActive = activeSection === sectionId;
                      
                      return (
                        <button
                          key={sectionId}
                          onClick={() => scrollToSection(sectionId)}
                          className={cn(
                            "w-full text-left px-2 py-1.5 rounded-sm text-xs transition-all duration-200",
                            "hover:bg-primary/8 focus:outline-none focus:ring-1 focus:ring-primary/20",
                            isActive 
                              ? "bg-primary/12 text-primary font-medium border-r-2 border-primary" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <span className={cn(
                              "text-xs mt-0.5 flex-shrink-0 w-4",
                              isActive ? "text-primary" : "text-muted-foreground/70"
                            )}>
                              {index + 1}.
                            </span>
                            <span className="leading-tight break-words min-w-0 flex-1">
                              {section.title.replace(/^\d+\.\s*/, '')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </CardContent>
            </Card>


          </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-none">
            <div ref={contentRef} className="space-y-4 sm:space-y-6 lg:pr-4 xl:pr-8">
                        {/* Header */}
            <Card className="shadow-lg border-muted/50 bg-gradient-to-br from-card via-card to-muted/5 overflow-hidden">
              <CardHeader className="text-center space-y-2 sm:space-y-3 pb-4 sm:pb-6 pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs font-medium border-primary/20 bg-primary/5">
                    <FileText className="h-3 w-3 mr-1 sm:mr-1.5" />
                    Legal Document
                  </Badge>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text leading-tight">
                    {title}
                  </h1>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Last Updated: <span className="font-medium">{lastUpdated}</span>
                  </p>
                </div>
              </CardHeader>
            </Card>


            {/* Search */}
            <Card className="shadow-lg border-muted/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4 px-4 sm:px-6 lg:px-8">
                <div className="relative max-w-full sm:max-w-sm mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search document..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-3 py-2.5 sm:py-2 text-sm border focus:border-primary/50 bg-background/50 h-11 sm:h-auto"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Introduction */}
            {introduction && (
              <Card className="shadow-lg border-muted/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8">
                  <div className="prose dark:prose-invert max-w-none">
                    {introduction.split('\n\n').map((paragraph, idx) => (
                      <p key={`intro-${idx}`} className="mb-3 sm:mb-4 leading-relaxed text-muted-foreground text-sm">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sections */}
            <div className="space-y-4 sm:space-y-6">
              {filteredSections.map((section, sectionIndex) => {
                const sectionId = getSectionId(section.title);
                const isCollapsed = collapsedSections.has(section.title);
                
                return (
                  <Card key={sectionId} className="shadow-lg border-muted/50 overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                    <CardHeader 
                      ref={(el) => {
                        if (el) sectionRefs.current[sectionId] = el;
                      }}
                      className="bg-gradient-to-r from-muted/20 to-muted/5 border-b border-muted/10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6"
                    >
                      <Collapsible>
                        <CollapsibleTrigger
                          onClick={() => toggleSectionCollapse(section.title)}
                          className="flex items-center justify-between w-full text-left group py-1 min-h-[44px] touch-manipulation"
                        >
                          <h2 className="text-base sm:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors duration-200 leading-tight tracking-wide uppercase text-muted-foreground pr-2">
                            {section.title}
                          </h2>
                          <div className="ml-2 sm:ml-4 p-1.5 rounded-md bg-background/30 group-hover:bg-primary/8 transition-colors duration-200 flex-shrink-0">
                            {isCollapsed ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className={isCollapsed ? "" : "mt-4 sm:mt-6 md:mt-8"}>
                          <CardContent className="pt-0 space-y-4 sm:space-y-6 md:space-y-8 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                            {/* Section Content */}
                            {section.content && (
                              <div className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none">
                                {section.content.split('\n\n').map((paragraph, idx) => (
                                  <p key={`content-${sectionIndex}-${idx}`} className="mb-4 sm:mb-6 leading-relaxed text-muted-foreground text-sm sm:text-base">
                                    {paragraph.trim()}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Section Items */}
                            {section.items && (
                              <div className="space-y-4">
                                {section.items.map((item, idx) => (
                                  <div key={`item-${sectionIndex}-${idx}`} className="p-3 sm:p-4 md:p-5 bg-muted/8 rounded-lg border-l-4 border-primary/15 hover:bg-muted/12 transition-colors duration-200">
                                    <div className="leading-relaxed text-muted-foreground text-sm sm:text-base">
                                      {item.split('\n').map((line, lineIdx) => (
                                        <p key={`item-line-${idx}-${lineIdx}`} className={lineIdx > 0 ? "mt-1.5 sm:mt-2" : ""}>
                                          {line.trim()}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Subsections */}
                            {section.subsections && (
                              <div className="space-y-6">
                                {section.subsections.map((subsection, subIdx) => (
                                  <div key={`subsection-${sectionIndex}-${subIdx}`} className="space-y-4">
                                    {subsection.subtitle && (
                                      <div className="p-5 bg-muted/8 rounded-lg border-l-4 border-primary/15 hover:bg-muted/12 transition-colors duration-200">
                                        <div className="space-y-3">
                                          <h3 className="text-lg font-semibold text-foreground leading-tight">
                                            {subsection.subtitle}
                                          </h3>
                                          <div className="space-y-3 ml-4">
                                            {subsection.items.map((item, itemIdx) => (
                                              <div key={`subitem-${sectionIndex}-${subIdx}-${itemIdx}`} className="flex gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2 flex-shrink-0"></div>
                                                <div className="leading-relaxed text-muted-foreground">
                                                  {item.split('\n').map((line, lineIdx) => (
                                                    <p key={`subitem-line-${itemIdx}-${lineIdx}`} className={lineIdx > 0 ? "mt-2" : ""}>
                                                      {line.trim()}
                                                    </p>
                                                  ))}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {!subsection.subtitle && (
                                      <div className="space-y-3">
                                        {subsection.items.map((item, itemIdx) => (
                                          <div key={`subitem-${sectionIndex}-${subIdx}-${itemIdx}`} className="p-5 bg-muted/8 rounded-lg border-l-4 border-primary/15 hover:bg-muted/12 transition-colors duration-200">
                                            <div className="leading-relaxed text-muted-foreground">
                                              {item.split('\n').map((line, lineIdx) => (
                                                <p key={`subitem-line-${itemIdx}-${lineIdx}`} className={lineIdx > 0 ? "mt-2" : ""}>
                                                  {line.trim()}
                                                </p>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Footer Actions */}
            <Card className="shadow-xl border-muted/50 bg-gradient-to-br from-card via-card to-muted/5 overflow-hidden">
              <CardContent className="pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center space-y-4 sm:space-y-6 md:space-y-8">
                <div className="text-center text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                  <span className="font-medium">Thank you for reading this document</span>
                </div>
                <div className="flex justify-center">
                  <Button asChild variant="outline" size="lg" className="h-11 sm:h-auto px-6 sm:px-8">
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span className="text-sm sm:text-base">Return to Home</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="lg"
          className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 z-40 shadow-2xl rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-200 touch-manipulation"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
    </div>
  );
} 