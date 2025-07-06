export interface Slide {
  id: string;
  slideName: string;
  type: string;
  content: ContentItem; // Assuming ContentItem is another defined type/interface
  slideOrder: number;
  className?: string; // Optional property
}

export type ContentType =
  | 'column'
  | 'resizable-column'
  | 'text'
  | 'paragraph'
  | 'image'
  | 'table'
  | 'multiColumn'
  | 'blank'
  | 'imageAndText'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'title'
  | 'heading4'
  | 'blockquote'
  | 'numberedList'
  | 'bulletedList'
  | 'code'
  | 'link'
  | 'quote'
  | 'divider'
  | 'calloutBox'
  | 'todoList'
  | 'codeBlock'
  | 'customButton'
  | 'tableOfContents';


export interface ContentItem {
  id: string;
  type: ContentType; // Assuming ContentType is an enum or string literal type defined elsewhere
  name: string;
  content:  ContentItem[] | string | string[] | string[][]; // Note: string | string[][] indicates an array of strings or a 2D array of strings
  initialRows?: number;
  initialColumns?: number;
  restrictToDrop?: boolean;
  columns?: number;
  placeholder?: string;
  className?: string;
  alt?: string;
  callOutType?: 'success' | 'warning' | 'question' | 'caution';
  link?: string;
  code?: string;
  language?: string;
  bgColor?: string;
  isTransparent?: boolean;
}

export interface Theme {
  name: string;
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  slideBackgroundColor: string;
  accentColor: string;
  gradientBackground?: string; // The '?' indicates this property is optional
  sidebarColor?: string;     // The '?' indicates this property is optional
  navbarColor?: string;      // The '?' indicates this property is optional
  type: 'light' | 'dark';
}

export type Prompt = {
  id:string,
  createdAt: string
  title:string
  outlines:OutlineCard[] | []
}

export type OutlineCard = {
  title: string,
  id: string
  order:number
}
export interface LayoutGroup {
  name: string;
  layouts: Layout[];
}

export interface Layout {
  name: string;
  icon: React.FC;
  type: string;
  component: LayoutSlides;
  layoutType: string;
}

export interface LayoutSlides {
  slideName: string;
  content: ContentItem
  className?: string;
  type: string;
}







export interface ComponentGroup {
  name: string;
  components: Component[];
}


interface Component {
  name: string;
  icon: string;
  type: string;
  component: ContentItem;
  componentType: string;
}
