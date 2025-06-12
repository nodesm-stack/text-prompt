import React, { useState } from 'react';

const CopyIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2" fill="#fff" stroke="#6366f1" strokeWidth="2"/>
        <rect x="3" y="3" width="13" height="13" rx="2" fill="#fff" stroke="#6366f1" strokeWidth="2"/>
    </svg>
);

const EditIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
        <path d="M4 20h4.586a1 1 0 0 0 .707-.293l10-10a1 1 0 0 0 0-1.414l-2.586-2.586a1 1 0 0 0-1.414 0l-10 10A1 1 0 0 0 4 15.414V20z" stroke="#fff" strokeWidth="2"/>
        <path d="M14.5 6.5l3 3" stroke="#fff" strokeWidth="2"/>
    </svg>
);

const Dashboard: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clarity, setClarity] = useState(0);
    const [specificity, setSpecificity] = useState(0);
    const [context, setContext] = useState(0);
    const [optimizedPrompt, setOptimizedPrompt] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://127.0.0.1:5000/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) {
                let errorMsg = 'Error: Failed to fetch';
                try {
                    const data = await response.json();
                    if (typeof data === 'object' && data !== null && 'error' in data) {
                        errorMsg = data.error;
                    }
                } catch (e) {}
                setError(errorMsg);
                setClarity(0);
                setSpecificity(0);
                setContext(0);
                setOptimizedPrompt('');
            } else {
                const data = await response.json();
                setClarity(data.clarity);
                setSpecificity(data.specificity);
                setContext(data.context);
                setOptimizedPrompt(data.optimizedPrompt);
            }
        } catch (err) {
            setError('Error: Failed to fetch');
            setClarity(0);
            setSpecificity(0);
            setContext(0);
            setOptimizedPrompt('');
        }
        setLoading(false);
    };

    const handleEdit = () => {
        setEditPrompt(optimizedPrompt);
        setIsEditing(true);
    };

    const handleSave = () => {
        setOptimizedPrompt(editPrompt);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div style={{
            maxWidth: 640,
            margin: '40px auto',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 0 24px rgba(0,0,0,0.08)',
            padding: 48,
            textAlign: 'center'
        }}>
            <h2 style={{marginBottom: 8}}>AI Prompt Optimizer</h2>
            <p style={{color: '#444', fontSize: 15, marginBottom: 24}}>
                Enter your AI prompt below. Get instant feedback and an optimized version for best results with LLMs.
            </p>
            <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={3}
                style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    marginBottom: 20,
                    fontSize: 16,
                    resize: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                }}
                placeholder="Enter your prompt here..."
            />
            <br />
            <button
                className="button"
                style={{
                    width: '60%',
                    background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 0',
                    marginBottom: 24,
                    cursor: 'pointer'
                }}
                onClick={handleAnalyze}
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Analyze & Optimize'}
            </button>
            <div style={{
                background: '#f8fafc',
                borderRadius: 8,
                padding: 20,
                marginBottom: 16
            }}>
                <h3 style={{margin: '0 0 16px 0', fontSize: 18, color: '#222'}}>Analysis Result</h3>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    gap: 24,
                    flexWrap: 'wrap',
                }}>
                    {/* Clarity Score */}
                    <div style={{
                        flex: '1 1 220px',
                        background: '#fff',
                        borderRadius: 24,
                        padding: 28,
                        margin: '0 0 24px 0',
                        minWidth: 220,
                        boxShadow: '0 6px 24px rgba(80,80,120,0.10)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transition: 'box-shadow 0.2s',
                        border: '1.5px solid #f3f4f6',
                        position: 'relative',
                    }}>
                        <div style={{fontWeight: 800, color: '#222', fontSize: 18, marginBottom: 8, letterSpacing: 0.5}}>Clarity Score</div>
                        <div style={{display: 'flex', alignItems: 'center', width: '100%', margin: '10px 0 8px 0'}}>
                            <span style={{color: '#f87171', fontWeight: 800, fontSize: 22, marginRight: 12}}>{clarity * 10}/100</span>
                            <div style={{flex: 1, height: 12, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden'}}>
                                <div style={{width: `${clarity * 10}%`, height: '100%', background: 'linear-gradient(90deg, #f87171 60%, #fbbf24 100%)', borderRadius: 6, transition: 'width 0.3s'}}></div>
                            </div>
                        </div>
                        <div style={{color: '#888', fontSize: 15, marginTop: 8, fontWeight: 500}}>Your prompt lacks clarity, which may lead to poor results.</div>
                        <div style={{position: 'absolute', top: 18, right: 18, opacity: 0.08, fontSize: 48, fontWeight: 900, pointerEvents: 'none'}}>C</div>
                    </div>
                    {/* Specificity Score */}
                    <div style={{
                        flex: '1 1 220px',
                        background: '#fff',
                        borderRadius: 24,
                        padding: 28,
                        margin: '0 0 24px 0',
                        minWidth: 220,
                        boxShadow: '0 6px 24px rgba(80,80,120,0.10)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transition: 'box-shadow 0.2s',
                        border: '1.5px solid #f3f4f6',
                        position: 'relative',
                    }}>
                        <div style={{fontWeight: 800, color: '#222', fontSize: 18, marginBottom: 8, letterSpacing: 0.5}}>Specificity Score</div>
                        <div style={{display: 'flex', alignItems: 'center', width: '100%', margin: '10px 0 8px 0'}}>
                            <span style={{color: '#60a5fa', fontWeight: 800, fontSize: 22, marginRight: 12}}>{specificity * 10}/100</span>
                            <div style={{flex: 1, height: 12, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden'}}>
                                <div style={{width: `${specificity * 10}%`, height: '100%', background: 'linear-gradient(90deg, #60a5fa 60%, #818cf8 100%)', borderRadius: 6, transition: 'width 0.3s'}}></div>
                            </div>
                        </div>
                        <div style={{color: '#888', fontSize: 15, marginTop: 8, fontWeight: 500}}>Your prompt is too vague, add specific requirements.</div>
                        <div style={{position: 'absolute', top: 18, right: 18, opacity: 0.08, fontSize: 48, fontWeight: 900, pointerEvents: 'none'}}>S</div>
                    </div>
                    {/* Context Score */}
                    <div style={{
                        flex: '1 1 220px',
                        background: '#fff',
                        borderRadius: 24,
                        padding: 28,
                        margin: '0 0 24px 0',
                        minWidth: 220,
                        boxShadow: '0 6px 24px rgba(80,80,120,0.10)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        transition: 'box-shadow 0.2s',
                        border: '1.5px solid #f3f4f6',
                        position: 'relative',
                    }}>
                        <div style={{fontWeight: 800, color: '#222', fontSize: 18, marginBottom: 8, letterSpacing: 0.5}}>Context Score</div>
                        <div style={{display: 'flex', alignItems: 'center', width: '100%', margin: '10px 0 8px 0'}}>
                            <span style={{color: '#34d399', fontWeight: 800, fontSize: 22, marginRight: 12}}>{context * 10}/100</span>
                            <div style={{flex: 1, height: 12, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden'}}>
                                <div style={{width: `${context * 10}%`, height: '100%', background: 'linear-gradient(90deg, #34d399 60%, #06b6d4 100%)', borderRadius: 6, transition: 'width 0.3s'}}></div>
                            </div>
                        </div>
                        <div style={{color: '#888', fontSize: 15, marginTop: 8, fontWeight: 500}}>Your prompt lacks necessary context for good results.</div>
                        <div style={{position: 'absolute', top: 18, right: 18, opacity: 0.08, fontSize: 48, fontWeight: 900, pointerEvents: 'none'}}>X</div>
                    </div>
                </div>
                <div style={{margin: '12px 0', textAlign: 'left'}}>
                    <div style={{fontWeight: 600}}>Optimized Prompt</div>
                    <div style={{
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        padding: 10,
                        minHeight: 32,
                        marginTop: 4,
                        fontSize: 15,
                        position: 'relative'
                    }}>
                        {isEditing ? (
                            <>
                                <textarea
                                    value={editPrompt}
                                    onChange={e => setEditPrompt(e.target.value)}
                                    style={{width: '100%', minHeight: 60, borderRadius: 6, border: '1px solid #ccc', padding: 8, fontSize: 15}}
                                />
                                <div style={{marginTop: 8, display: 'flex', gap: 8}}>
                                    <button
                                        style={{background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer'}}
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        style={{background: '#e5e7eb', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer'}}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>{optimizedPrompt}</>
                        )}
                    </div>
                </div>
                {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
            </div>
            <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
                <button
                    className="button"
                    style={{
                        background: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => navigator.clipboard.writeText(optimizedPrompt)}
                    disabled={!optimizedPrompt}
                    title="Copy Prompt"
                >
                    <CopyIcon />
                </button>
                <button
                    className="button"
                    style={{background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    onClick={handleEdit}
                    disabled={!optimizedPrompt}
                    title="Edit Prompt"
                >
                    <EditIcon />
                </button>
                <button
                    className="button"
                    style={{background: '#10a37f'}}
                    onClick={() => window.open('https://chat.openai.com/', '_blank')}
                >
                    Open in ChatGPT
                </button>
                <button
                    className="button"
                    style={{background: '#2563eb'}}
                    onClick={() => window.open('https://claude.ai/', '_blank')}
                >
                    Open in Claude
                </button>
            </div>
        </div>
    );
};

export default Dashboard;