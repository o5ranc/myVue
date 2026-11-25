// KanbanList와 KanbanItem이 함께 쓰는 타입입니다.
export interface KanbanCard {
  id: number
  title: string
  type?: string
  assignName?: string
  content?: string
}

export interface KanbanColumn {
  id: number
  title: string
  items: KanbanCard[]
}
