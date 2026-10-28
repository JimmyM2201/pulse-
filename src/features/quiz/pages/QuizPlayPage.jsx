import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Trophy,
  Award,
  RotateCcw,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import {
  useQuizQuestion,
  useSubmitQuizAnswer,
  useQuizScores,
} from '../hooks/useQuiz'
import { Button } from '../../../components/ui/Button'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Skeleton } from '../../../components/ui/Skeleton'
import { DateDisplay } from '../../../components/ui/DateDisplay'

export function QuizPlayPage() {
  const { quizId } = useParams()
  const queryClient = useQueryClient()

  const [questionNumber, setQuestionNumber] = useState(1)
  const [selectedOption, setSelectedOption] = useState(null)
  const [submittedResult, setSubmittedResult] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)

  // Fetch current question from backend
  const {
    data: questionData,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    error: questionError,
    refetch: refetchQuestion,
  } = useQuizQuestion({
    quiz_id: quizId,
    question_number: questionNumber,
  })

  // Submit answer mutation
  const { mutate: doSubmitAnswer, isPending: isSubmitting } =
    useSubmitQuizAnswer({
      onSuccess: (data) => {
        setSubmittedResult(data)
        // Invalidate backend scores so fresh scores are fetched
        queryClient.invalidateQueries({ queryKey: queryKeys.quiz.scores() })
      },
    })

  // Fetch verified score from backend API when quiz is completed
  const {
    data: scoreData,
    isLoading: isScoreLoading,
    isError: isScoreError,
    error: scoreError,
    refetch: refetchScore,
  } = useQuizScores(
    { quiz_id: quizId },
    {
      enabled: Boolean(isCompleted && quizId),
    }
  )

  const handleSelectOption = (key) => {
    if (submittedResult) return
    setSelectedOption(key)
  }

  const handleSubmit = () => {
    if (!selectedOption || isSubmitting || submittedResult) return
    doSubmitAnswer({
      quiz_id: quizId,
      question_number: questionNumber,
      answer: selectedOption,
    })
  }

  const handleNext = () => {
    if (submittedResult?.has_next) {
      setQuestionNumber((prev) => prev + 1)
      setSelectedOption(null)
      setSubmittedResult(null)
    } else {
      setIsCompleted(true)
    }
  }

  const handleRetake = () => {
    setQuestionNumber(1)
    setSelectedOption(null)
    setSubmittedResult(null)
    setIsCompleted(false)
  }

  // ==========================================
  // Backend Score Summary Screen
  // ==========================================
  if (isCompleted) {
    const backendScore =
      scoreData?.scores?.find((s) => s.quiz_id === quizId) ||
      scoreData?.scores?.[0]
    const overallScore = scoreData?.overall_score

    const correctCount = backendScore?.correct_count ?? 0
    const totalCount =
      backendScore?.total_questions ?? questionData?.total_questions ?? 1
    const answeredCount = backendScore?.answered_count ?? totalCount
    const percentage = Math.round((correctCount / totalCount) * 100)

    return (
      <div className="w-full max-w-2xl mx-auto py-6 sm:py-10 font-sans">
        <div className="bg-white border border-[#e5e5e5] rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          {/* Trophy Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#d09724]/10 border border-[#d09724]/20 flex items-center justify-center text-[#d09724] mb-6">
            <Trophy className="w-10 h-10" />
          </div>

          <p className="text-xs font-bold tracking-widest text-[#2d5356] uppercase mb-1">
            QUIZ COMPLETED
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#000000] tracking-tight mb-2">
            {backendScore?.topic || questionData?.topic || 'Quiz Results'}
          </h1>
          <p className="text-sm text-[#525252] max-w-md mx-auto mb-8">
            Your results have been recorded in the database. Here is your verified score from the backend:
          </p>

          {/* Loading Score from Backend */}
          {isScoreLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          )}

          {/* Error loading backend score */}
          {!isScoreLoading && isScoreError && (
            <div className="mb-8">
              <ErrorState
                title="Could not load final score"
                message={
                  scoreError?.data?.message ||
                  scoreError?.message ||
                  'Failed to fetch your score from the server.'
                }
                onRetry={() => refetchScore()}
              />
            </div>
          )}

          {/* Verified Backend Score Cards */}
          {!isScoreLoading && !isScoreError && (
            <div className="space-y-4 max-w-md mx-auto mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Quiz Score Box */}
                <div className="bg-[#f6f6f6] border border-[#e5e5e5] rounded-2xl p-5">
                  <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-[#2d5356]" />
                    Quiz Score
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#2d5356]">
                    {backendScore?.score || `${correctCount}/${totalCount}`}
                  </div>
                  <span className="text-xs font-semibold text-[#2d5356] mt-1 inline-block">
                    {percentage}% Accuracy ({correctCount} of {totalCount})
                  </span>
                </div>

                {/* Overall Score Box */}
                <div className="bg-[#f6f6f6] border border-[#e5e5e5] rounded-2xl p-5">
                  <span className="text-xs font-medium text-[#737373] flex items-center gap-1.5 mb-1">
                    <BarChart3 className="w-3.5 h-3.5 text-[#d09724]" />
                    Overall User Score
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#d09724]">
                    {overallScore?.score || '—'}
                  </div>
                  <span className="text-xs font-medium text-[#737373] mt-1 inline-block">
                    Across all attended quizzes
                  </span>
                </div>
              </div>

              {/* Extra stats footer */}
              <div className="bg-white border border-[#f0f0f0] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-[#737373]">
                <span>Questions answered: {answeredCount} of {totalCount}</span>
                <DateDisplay
                  date={backendScore?.updated_at}
                  showIcon
                  iconClassName="w-3 h-3"
                  className="flex items-center gap-1"
                  options={{ hour: '2-digit', minute: '2-digit' }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleRetake}
              className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </Button>
            <Link to="/quizzes" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Back to All Quizzes</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // Active Question Play View
  // ==========================================
  const totalQuestions = questionData?.total_questions || 1
  const progressPercent = Math.min(
    100,
    Math.round((questionNumber / totalQuestions) * 100)
  )

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 font-sans py-4 sm:py-6">
      {/* Top Navigation & Back Link */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#525252] hover:text-[#2d5356] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quizzes</span>
        </Link>

        {questionData?.topic && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2d5356]/10 text-[#2d5356] border border-[#2d5356]/20">
            <Sparkles className="w-3.5 h-3.5" />
            {questionData.topic}
          </span>
        )}
      </div>

      {/* Loading Skeleton State */}
      {isQuestionLoading && (
        <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-8 w-3/4 rounded-md mt-6 mb-8" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isQuestionLoading && isQuestionError && (
        <ErrorState
          title="Unable to load question"
          message={
            questionError?.data?.message ||
            questionError?.message ||
            'Failed to fetch this quiz question. Please try again.'
          }
          onRetry={() => refetchQuestion()}
        />
      )}

      {/* Main Question Card */}
      {!isQuestionLoading && !isQuestionError && questionData && (
        <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 sm:p-10 shadow-sm space-y-7">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#525252]">
              <span className="uppercase tracking-wider text-[#2d5356]">
                Question {questionData.question_number} of {totalQuestions}
              </span>
              <span>{progressPercent}% Complete</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-[#f0f0f0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2d5356] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight leading-snug">
              {questionData.question}
            </h2>
          </div>

          {/* Options List (A, B, C, D) */}
          <div className="space-y-3 pt-1">
            {Object.entries(questionData.options || {}).map(([key, text]) => {
              const isSelected = selectedOption === key
              const isSubmitted = Boolean(submittedResult)
              const isAnswerSubmitted =
                submittedResult?.submitted_answer === key
              const isCorrectAnswer =
                isAnswerSubmitted && submittedResult?.is_correct

              let containerClass =
                'border-[#e5e5e5] bg-white hover:border-[#2d5356]/50 hover:bg-[#f6f6f6]/60 text-[#000000]'
              let badgeClass =
                'bg-[#f6f6f6] text-[#525252] border border-[#e5e5e5]'

              if (isSubmitted) {
                if (isAnswerSubmitted) {
                  if (isCorrectAnswer) {
                    containerClass =
                      'border-[#12b76a] bg-[#ecfdf3] text-[#027a48]'
                    badgeClass = 'bg-[#12b76a] text-white border-transparent'
                  } else {
                    containerClass =
                      'border-[#f04438] bg-[#fef3f2] text-[#b42318]'
                    badgeClass = 'bg-[#f04438] text-white border-transparent'
                  }
                } else {
                  containerClass =
                    'border-[#e5e5e5] bg-white text-[#737373] opacity-60'
                }
              } else if (isSelected) {
                containerClass =
                  'border-[#2d5356] bg-[#2d5356]/5 text-[#2d5356] ring-2 ring-[#2d5356]/20'
                badgeClass = 'bg-[#2d5356] text-white border-transparent'
              }

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(key)}
                  className={`w-full p-4 sm:p-4.5 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-150 select-none ${
                    isSubmitted ? 'cursor-default' : 'cursor-pointer'
                  } ${containerClass}`}
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeClass}`}
                    >
                      {key}
                    </span>
                    <span className="text-sm sm:text-base font-medium leading-relaxed">
                      {text}
                    </span>
                  </div>

                  {/* Feedback icon after submission */}
                  {isSubmitted && isAnswerSubmitted && (
                    <div className="shrink-0">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-[#12b76a]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#f04438]" />
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback message banner */}
          {submittedResult && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
                submittedResult.is_correct
                  ? 'bg-[#ecfdf3] border-[#a6f4c5] text-[#027a48]'
                  : 'bg-[#fef3f2] border-[#fecdca] text-[#b42318]'
              }`}
            >
              <div className="flex items-center gap-2.5 font-medium">
                {submittedResult.is_correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#12b76a] shrink-0" />
                    <span>
                      Correct answer! +{submittedResult.points ?? 1} point
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-[#f04438] shrink-0" />
                    <span>Incorrect. Keep your focus for the next question!</span>
                  </>
                )}
              </div>

              {submittedResult?.quiz_score && (
                <span className="font-semibold shrink-0">
                  Current Score: {submittedResult.quiz_score.score}
                </span>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#f0f0f0] flex items-center justify-between gap-4">
            <span className="text-xs text-[#737373]">
              {!submittedResult
                ? 'Select one option to continue'
                : submittedResult.has_next
                ? 'Ready for the next question'
                : 'Final question answered'}
            </span>

            {!submittedResult ? (
              <Button
                variant="primary"
                size="md"
                disabled={!selectedOption || isSubmitting}
                isLoading={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl font-medium cursor-pointer"
              >
                Submit Answer
              </Button>
            ) : submittedResult.has_next ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="md"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Summary</span>
                <Award className="w-4 h-4 ml-0.5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
