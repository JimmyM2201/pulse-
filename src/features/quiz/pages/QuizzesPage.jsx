import { useMemo } from 'react'
import { useQuizzes, useQuizScores } from '../hooks/useQuiz'
import { QuizCard } from '../components/QuizCard'
import { QuizSkeleton } from '../components/QuizSkeleton'
import { ErrorState } from '../../../components/ui/ErrorState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { HelpCircle, Trophy } from 'lucide-react'

export function QuizzesPage() {
  const { data: quizzes, isLoading, isError, error, refetch } = useQuizzes()
  const { data: scoresData } = useQuizScores()

  // Map quiz_id -> score record from backend
  const scoresByQuizId = useMemo(() => {
    const map = {}
    if (Array.isArray(scoresData?.scores)) {
      scoresData.scores.forEach((s) => {
        if (s.quiz_id) {
          map[s.quiz_id] = s
        }
      })
    }
    return map
  }, [scoresData])

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Page Header */}
      <div>
        <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#2d5356] uppercase mb-1">
          TEST YOUR KNOWLEDGE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#000000] tracking-tight">
          Quizzes
        </h1>
        <p className="text-sm text-[#525252] mt-2 max-w-2xl">
          Challenge yourself with interactive quizzes designed to strengthen your understanding across various topics.
        </p>
      </div>

      {/* Overall Score Banner from Backend */}
      {scoresData?.overall_score && Array.isArray(scoresData?.scores) && scoresData.scores.length > 0 && (
        <div className="bg-[#2d5356]/5 border border-[#2d5356]/15 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#2d5356] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-5 h-5 text-[#d09724]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#000000]">
                Your Quiz Performance
              </h3>
              <p className="text-xs text-[#525252]">
                Verified results recorded across {scoresData.scores.length} attended{' '}
                {scoresData.scores.length === 1 ? 'quiz' : 'quizzes'}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[#2d5356]/10 pt-3 sm:pt-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-medium text-[#737373] block uppercase tracking-wider">
                Overall Score
              </span>
              <span className="font-serif text-2xl font-bold text-[#2d5356]">
                {scoresData.overall_score.score}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <QuizSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Unable to load quizzes"
          message={
            error?.data?.message ||
            error?.message ||
            'We had trouble fetching the quizzes. Please try again.'
          }
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!quizzes || quizzes.length === 0) && (
        <EmptyState
          icon={HelpCircle}
          title="No quizzes available"
          description="There are no active quizzes published at the moment. Please check back later!"
        />
      )}

      {/* Quizzes Grid */}
      {!isLoading && !isError && Array.isArray(quizzes) && quizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {quizzes.map((quiz) => {
            const quizKey = quiz.id || quiz._id
            return (
              <QuizCard
                key={quizKey}
                quiz={quiz}
                userScore={scoresByQuizId[quizKey]}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
