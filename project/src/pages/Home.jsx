import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Blocks from '../components/Blocks';
import './Page.css';

export default function Home() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPage() {
      try {
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'home')
          .eq('published', true)
          .maybeSingle();

        if (pageError) throw pageError;
        if (!page) throw new Error('Page not found');

        const { data: blocksData, error: blocksError } = await supabase
          .from('page_blocks')
          .select('*')
          .eq('page_id', page.id)
          .order('position');

        if (blocksError) throw blocksError;

        setBlocks(blocksData || []);
      } catch (err) {
        console.error('Error loading page:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <h1>Error Loading Page</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <Blocks blocks={blocks} />
    </div>
  );
}
