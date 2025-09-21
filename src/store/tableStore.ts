import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ColumnSizingState } from '@tanstack/react-table';

interface TableState {
  // Column sizing for different tables
  columnSizing: {
    projects: ColumnSizingState;
    topics: ColumnSizingState;
    candidates: ColumnSizingState;
    interns: ColumnSizingState;
    staff: ColumnSizingState;
  };
  
  // Tab selections
  activeTab: {
    projects: 'active' | 'archive';
    topics: 'active' | 'archive';
    candidates: 'active' | 'archive';
    interns: 'active' | 'archive';
    staff: 'active' | 'archive';
  };
  
  // View type for projects
  projectViewType: 'programs' | 'products' | 'projects';
  
  // Actions
  setColumnSizing: (table: 'projects' | 'topics' | 'candidates' | 'interns' | 'staff', sizing: ColumnSizingState) => void;
  setActiveTab: (table: 'projects' | 'topics' | 'candidates' | 'interns' | 'staff', tab: 'active' | 'archive') => void;
  setProjectViewType: (viewType: 'programs' | 'products' | 'projects') => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      columnSizing: {
        projects: {},
        topics: {},
        candidates: {},
        interns: {},
        staff: {},
      },
      activeTab: {
        projects: 'active',
        topics: 'active',
        candidates: 'active',
        interns: 'active',
        staff: 'active',
      },
      projectViewType: 'projects',
      
      setColumnSizing: (table, sizing) =>
        set((state) => ({
          columnSizing: {
            ...state.columnSizing,
            [table]: sizing,
          },
        })),
      
      setActiveTab: (table, tab) =>
        set((state) => ({
          activeTab: {
            ...state.activeTab,
            [table]: tab,
          },
        })),
      
      setProjectViewType: (viewType) =>
        set({ projectViewType: viewType }),
    }),
    {
      name: 'table-storage', // localStorage key
      partialize: (state) => ({
        columnSizing: state.columnSizing,
        activeTab: state.activeTab,
        projectViewType: state.projectViewType,
      }),
    }
  )
);
