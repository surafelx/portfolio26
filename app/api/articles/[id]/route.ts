import { getArticles, updateArticle, deleteArticle } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('API: Fetching article with ID:', params.id);

    const articles = await getArticles();
    console.log('API: Found', articles.length, 'total articles');

    const article = articles.find(a => a.id === params.id);

    if (article) {
      console.log('API: Article found:', article.title);
      return NextResponse.json(article);
    } else {
      console.log('API: Article not found with ID:', params.id);
      return NextResponse.json({
        error: 'Article not found',
        requestedId: params.id,
        availableArticles: articles.map(a => ({ id: a.id, title: a.title }))
      }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error fetching article:', error);

    // Provide more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Internal Server Error',
      message: errorMessage,
      requestedId: params.id
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedArticle = await updateArticle(params.id, body);
    if (updatedArticle) {
      return NextResponse.json(updatedArticle);
    } else {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteArticle(params.id);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}